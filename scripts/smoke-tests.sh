#! /bin/bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";
. "$SCRIPT_DIR/smoke.sh"

# Proxy url
smoke_url_ok "https://$LINKR_DOMAIN"

# Admin url
API_KEY=$(aws secretsmanager get-secret-value --secret-id linkr-api-key | jq ".SecretString | fromjson | .key" -r)
smoke_header "x-api-key: $API_KEY"
smoke_url_ok "https://api.$LINKR_DOMAIN"