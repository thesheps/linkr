#! /bin/bash

# Test constants
SHORT_URL="/sR6SA"

# Import smoke.sh library
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";
. "$SCRIPT_DIR/smoke.sh"

# Smoke admin api
API_KEY=$(aws secretsmanager get-secret-value --secret-id linkr-api-key | jq ".SecretString | fromjson | .key" -r)
smoke_header "x-api-key: $API_KEY"
smoke_form_ok "https://api.$LINKR_DOMAIN/entries" "$SCRIPT_DIR/test-url"
smoke_assert_body "{\"shortUrl\":\"$SHORT_URL\"}"

# Smoke proxy api
smoke_url_ok "https://$LINKR_DOMAIN"
smoke_url_ok "https://sheps.link$SHORT_URL"