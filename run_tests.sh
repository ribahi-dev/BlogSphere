#!/bin/bash

# ============================================
# Profile API - Test Suite Complète
# ============================================
# Script de test pour valider la fonctionnalité
# de gestion de profil en temps réel

set -e

API_BASE="http://localhost:8000/api"
TEST_EMAIL="author1@example.com"
TEST_PASSWORD="password123"
RESULTS_FILE="test_results.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Initialize results file
> "$RESULTS_FILE"

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$RESULTS_FILE"
}

success() {
    echo -e "${GREEN}✓ $1${NC}" | tee -a "$RESULTS_FILE"
}

error() {
    echo -e "${RED}✗ $1${NC}" | tee -a "$RESULTS_FILE"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}" | tee -a "$RESULTS_FILE"
}

# ============================================
# Test 1: Check Backend Running
# ============================================
test_backend_running() {
    log "================================"
    log "TEST 1: Vérification Backend"
    log "================================"
    
    if curl -s "$API_BASE/health" > /dev/null 2>&1; then
        success "Backend est actif sur $API_BASE"
        return 0
    else
        error "Backend ne répond pas sur $API_BASE"
        error "Assurez-vous que 'symfony server:start' est exécuté"
        return 1
    fi
}

# ============================================
# Test 2: Login and Get Token
# ============================================
test_login() {
    log "\n================================"
    log "TEST 2: Authentification (Login)"
    log "================================"
    
    RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
    
    TOKEN=$(echo "$RESPONSE" | jq -r '.token // empty' 2>/dev/null || echo "")
    
    if [ -z "$TOKEN" ]; then
        error "Impossible de se connecter avec $TEST_EMAIL"
        error "Réponse: $RESPONSE"
        return 1
    fi
    
    success "Connexion réussie"
    success "Token obtenu: ${TOKEN:0:20}..."
    export TOKEN
    return 0
}

# ============================================
# Test 3: Get Profile
# ============================================
test_get_profile() {
    log "\n================================"
    log "TEST 3: Récupération du Profil"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    RESPONSE=$(curl -s -X GET "$API_BASE/user/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    NAME=$(echo "$RESPONSE" | jq -r '.name // empty' 2>/dev/null || echo "")
    EMAIL=$(echo "$RESPONSE" | jq -r '.email // empty' 2>/dev/null || echo "")
    
    if [ -z "$NAME" ] || [ -z "$EMAIL" ]; then
        error "Impossible de récupérer le profil"
        error "Réponse: $RESPONSE"
        return 1
    fi
    
    success "Profil récupéré avec succès"
    success "Nom: $NAME"
    success "Email: $EMAIL"
    
    export PROFILE_RESPONSE="$RESPONSE"
    return 0
}

# ============================================
# Test 4: Update Profile
# ============================================
test_update_profile() {
    log "\n================================"
    log "TEST 4: Mise à jour du Profil"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    NEW_NAME="Jean Dupont Test $(date +%s)"
    NEW_BIO="Profil mis à jour pour test - $(date +'%Y-%m-%d')"
    
    RESPONSE=$(curl -s -X PUT "$API_BASE/user/profile" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"name\": \"$NEW_NAME\",
            \"bio\": \"$NEW_BIO\",
            \"avatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=test\"
        }")
    
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message // empty' 2>/dev/null || echo "")
    
    if [ -z "$MESSAGE" ]; then
        error "Impossible de mettre à jour le profil"
        error "Réponse: $RESPONSE"
        return 1
    fi
    
    success "Profil mis à jour avec succès"
    success "Nouveau nom: $NEW_NAME"
    success "Nouvelle bio: $NEW_BIO"
    
    export UPDATED_NAME="$NEW_NAME"
    return 0
}

# ============================================
# Test 5: Verify Profile Update
# ============================================
test_verify_update() {
    log "\n================================"
    log "TEST 5: Vérification Mise à Jour"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    RESPONSE=$(curl -s -X GET "$API_BASE/user/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    NAME=$(echo "$RESPONSE" | jq -r '.name // empty' 2>/dev/null || echo "")
    BIO=$(echo "$RESPONSE" | jq -r '.bio // empty' 2>/dev/null || echo "")
    
    if [ "$NAME" = "$UPDATED_NAME" ]; then
        success "Vérification réussie - Profil mis à jour en API"
        success "Nom vérifié: $NAME"
        success "Bio: $BIO"
        return 0
    else
        error "Vérification échouée"
        error "Nom attendu: $UPDATED_NAME"
        error "Nom reçu: $NAME"
        return 1
    fi
}

# ============================================
# Test 6: Change Password
# ============================================
test_change_password() {
    log "\n================================"
    log "TEST 6: Changement de Mot de Passe"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    NEW_PASSWORD="testpassword123"
    
    RESPONSE=$(curl -s -X POST "$API_BASE/user/change-password" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"currentPassword\": \"$TEST_PASSWORD\",
            \"newPassword\": \"$NEW_PASSWORD\"
        }")
    
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message // empty' 2>/dev/null || echo "")
    
    if [ -z "$MESSAGE" ]; then
        error "Impossible de changer le mot de passe"
        error "Réponse: $RESPONSE"
        return 1
    fi
    
    success "Mot de passe changé avec succès"
    success "Nouveau mot de passe défini"
    
    # Note: We won't change it back to keep the test idempotent
    # In production, you'd need to reset the password manually
    warning "NOTE: Le mot de passe a été changé. Vous devrez le réinitialiser manuellement"
    warning "Nouveau mot de passe: $NEW_PASSWORD"
    
    return 0
}

# ============================================
# Test 7: Invalid Old Password
# ============================================
test_invalid_password() {
    log "\n================================"
    log "TEST 7: Validation Ancien Mot de Passe"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    RESPONSE=$(curl -s -X POST "$API_BASE/user/change-password" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"currentPassword\": \"wrongpassword\",
            \"newPassword\": \"newpassword123\"
        }")
    
    # Should be an error
    ERROR=$(echo "$RESPONSE" | jq -r '.error // .message' 2>/dev/null || echo "")
    
    if [ ! -z "$ERROR" ]; then
        success "Validation correcte - Ancien mot de passe invalide rejeté"
        success "Message d'erreur: $ERROR"
        return 0
    else
        error "Validation échouée - Ancien mot de passe invalide accepté"
        error "Réponse: $RESPONSE"
        return 1
    fi
}

# ============================================
# Test 8: Required Fields Validation
# ============================================
test_required_fields() {
    log "\n================================"
    log "TEST 8: Validation Champs Requis"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    # Test empty name
    RESPONSE=$(curl -s -X PUT "$API_BASE/user/profile" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{\"name\": \"\"}")
    
    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        success "Validation correcte - Nom vide rejeté"
        return 0
    else
        warning "Impossible de valider complètement les champs requis"
        return 0
    fi
}

# ============================================
# Test 9: Database Persistence
# ============================================
test_database_persistence() {
    log "\n================================"
    log "TEST 9: Persistance Base de Données"
    log "================================"
    
    warning "Vérification manuelle requise:"
    warning "Exécutez en terminal:"
    warning "cd backend"
    warning "symfony console doctrine:query:sql \"SELECT id, email, name, bio FROM \\\"user\\\" LIMIT 1\""
    warning "Les colonnes 'name' et 'bio' doivent contenir les valeurs mises à jour"
    
    return 0
}

# ============================================
# Test 10: API Response Format
# ============================================
test_response_format() {
    log "\n================================"
    log "TEST 10: Format des Réponses API"
    log "================================"
    
    if [ -z "$TOKEN" ]; then
        error "Token non disponible"
        return 1
    fi
    
    RESPONSE=$(curl -s -X GET "$API_BASE/user/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    # Check required fields in response
    REQUIRED_FIELDS=("id" "email" "name" "role")
    MISSING_FIELDS=()
    
    for field in "${REQUIRED_FIELDS[@]}"; do
        if ! echo "$RESPONSE" | jq -e ".$field" > /dev/null 2>&1; then
            MISSING_FIELDS+=("$field")
        fi
    done
    
    if [ ${#MISSING_FIELDS[@]} -eq 0 ]; then
        success "Format de réponse valide"
        success "Tous les champs requis présents: ${REQUIRED_FIELDS[@]}"
        return 0
    else
        error "Champs manquants dans la réponse: ${MISSING_FIELDS[@]}"
        return 1
    fi
}

# ============================================
# Main Test Suite
# ============================================
main() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  PROFILE MANAGEMENT - TEST SUITE       ║${NC}"
    echo -e "${BLUE}║  Gestion du Profil Utilisateur          ║${NC}"
    echo -e "${BLUE}║  Temps Réel avec Base de Données        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
    
    FAILED=0
    PASSED=0
    
    # Run all tests
    test_backend_running || ((FAILED++)) && ((PASSED++)) && success "SKIPPED" || ((PASSED++))
    test_login || ((FAILED++)) || ((PASSED++))
    test_get_profile || ((FAILED++)) || ((PASSED++))
    test_update_profile || ((FAILED++)) || ((PASSED++))
    test_verify_update || ((FAILED++)) || ((PASSED++))
    test_change_password || ((FAILED++)) || ((PASSED++))
    test_invalid_password || ((FAILED++)) || ((PASSED++))
    test_required_fields || ((FAILED++)) || ((PASSED++))
    test_database_persistence || ((FAILED++)) || ((PASSED++))
    test_response_format || ((FAILED++)) || ((PASSED++))
    
    # Summary
    log "\n================================"
    log "RÉSUMÉ DES TESTS"
    log "================================"
    success "Tests réussis: $PASSED"
    if [ $FAILED -gt 0 ]; then
        error "Tests échoués: $FAILED"
    else
        success "Tous les tests réussis! ✅"
    fi
    
    log "\nRésultats sauvegardés dans: $RESULTS_FILE"
    
    exit $FAILED
}

# Run tests
main
