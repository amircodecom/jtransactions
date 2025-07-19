

# Transaction
| Field         | Value  | REF/ENUM  |
| --------------| -----  | ----- |
| id            |  ""    |  |
| timestamp     | ""     | #common.timestamps.defs.iso860 |
| status        | enum   | [pending, completed, failed, reversed, disputed] |
| reported_by   | enun   | [initiator, receiver, system] |
| initiator     | {} type[person,biz,system], id, name, tax_id | #common.parties.defs.party  |
| receiver      | ~      | #common.parties.defs.party |
| instruments   |        | oneOf INSTRUMENT |
| amount        | {} value, currency, converted_value, converted_currency, exchange_rate      | #common.currency |
| location      | {} type[physical, online, hybrid], geo{lat,lon,accurecy_meters}, ip_address, device_id, address       | #common.location |
| items []      | {} id, description*, sku, quantity*, unit_price*, tax | .tax:common.currency.defs.tax |
| evidence []   |        | oneof:#instruments.base.evidence#digital/physical |
| metadata      | {} purpose, reference, tags[""], risk_score |

---

Intruments (type): bank_account, check, certified_check, money_order, gift_card, credit_card, debit_card, p2p_app, pos, atm, crypto, mobile_wallet, wire_transfer, interac_transfer

# Instrument

| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| id           | ""        ||
| type         | enum      | see above |
| belongs_to   | | #common.parties.defs.party_relation |
| role         | enum      | [funding_source, payment_method, receving_account, authorization_device, purchase_item, itermediary] |


#### Evidence

| DFN           | Field            | Value        | REF/ENUM  |
| ------------  | ---------------- | -------------| ----------|
| BASE          | evidence_type    |""  | 
|               | timestamp        |              | #common.timestamps.defs.iso8601 |
|               | storage_ref      | "" | note: location of evidence doc |
|               | | |
| DIGITAL:BASE  | evidence_type    | enum  | [digital_signature, biometric_verification, confidence_score ] |
|               | confidence_score | number 0-100 | |
|               | | |
| PHYSICAL:BASE | evidence_type    | enum | [check_image, id_scan, signature_card ] |
|               | geo_location     |  {lat,lon, accurecy_meters}     | #common.location.props.geo |


#### Metadata
| DFN           | Field            | Value        | REF/ENUM  |
| ------------  | ---------------- | -------------| ----------|
| BASE          | risk_score       | number 0-100  ||
|               | tags []          | ["",] ||
|               | expiry           |  | #common.timstamp.defs.iso8601 |
| | | |
| DIGITAL:BASE  | device_id        | "" | |
|               | ip_address       | "" | |
| | | |
| PHYSICAL:BASE | location         | ~see txn.location | #common.location |
|               | carrier          | "" |


---
---


## ATM
| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "atm"     ||
| atm          | {}        | |
|              | .terminal_id | |
|              | .operator | [bank,independent, retail] |
|              | .location "" | |
|              | .surcharge | |
| metadata     | {} | |
|              | . network | [plus, cirrus, star, pulse] |
|              | .cash_available | |
| evidence  [] | {evidence_type="atm_receipt" , receipt_number} | |
|              | or {evidence_type="card_retenton", retained(bool)} | |


## POS
| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "pos"     | |
| pos          | {} | |
|              | .terminal_id | |
|              | .merchant_id | |
|              | .store_id  | |
|              | .operator_id | |
|              | .entry_method | [chip, swipe, tap, manual] |
| metadata     | {} | |
|              | .mcc | "" |
|              | .tax_amount (number) | |
| evidence[]   | {evidence_type="receipt", receipt_number, items[ {descr,price}, ..] | |
|              | or {evidence_type="authorization", approval_code } | |


## Bank Acount
| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "bank_account"     | |
| bank_account | {} | |
|              | .routing_number | |
|              | .account_number | |
|              | .account_type  |  [checking, savings, money_market] |
|              | .bank_name | |
| metadata     | {}:BASE  |  |
|              | .account_age_days (int) | |
|              | .verified (bool) | |
| evidence     | {evidence_type: "micro_deposits", amount_1, amount2} | |
|              | or BASE |



## P2P APP

| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "p2p_app" | |
| p2p_app      | {}        | |
|              | .provider | [venmo, paypal, zelle, cashapp, wise, revolut] |
|              | .account_id | |
|              | .handle | |
|              | .instant_transfer (bool | |
| metadata     | {} | |
|              | .account_age_days (int) | |
|              | .verified (bool) | |
| evidence[]   | { evidence_type: "transaction_receipt", receipt_id, timestamp} | |
|              | or {evidence_type: "balance_confirmation", available_balance} | |






## Credit Card
| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "credit_card"     | |
| credit_card  | {} | |
|              | .last_four | |
|              | .network   | [visa, mastercard, amex, discover, jcb, diners] |
|              | .expiry  | |
|              | .cardholder_name "" | |
|              | .tokenized (bool) | |
| metadata     | {}:BASE  | |
|              | .is_business_card (bool) | |
|              | .is_prepaid (bool) | |
| evidence[]   | {evidence_type: "authorization", auth_ocde, processor_response} | |
|              | or {evidence_type: "avs_match", address_match(bool), zip_match (bool) | |
|              | or {evidence_type: "cvv_check", cvv_match (bool) | |



## Debit Card : BASE + ** CREDIT CARD ** 
| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "debit_card"     | |
| debit_card   | {}  | |
|              | .linked_account | [checking | saving ] |
|              | .bank_name | |
|              | .requires_pin | |
| metadata     | {}  | |
|              | .daily_withdrawal_limit (num) | |
|              | .pos_limit (num) | |


## Gift Card 
| Field        | Value     | REF/ENUM  |
| ------------ | --------- | ----------|
| type         | "gift_card"     | |
| gift_Card    | {}  | |
|              | .card_number  | |
|              | .pin | |
|              | .issuer  | [visa, mastercard, amex, retailer ] |
|              | .initial_balance (number) | |
|              | .remaining_balance (number) | |
|              | .expiration_date | #common.timestamps.defs.iso86010 |
| metadata     | { } | |
|              | .purchase_location | |
|              | .restrictions [""] | [online_only, in_store_only, no_cash_access, international_blocked ] |
| evidence[]   | { evidence_type": "activation_receipt", receipt_number } | |
|              | or {evidence_type: "balance_check", balance (num), timstamp#iso } | |


## Mobile Wallet

| Field         | Value     | REF/ENUM  |
| ------------  | --------- | ----------|
| type          | "mobile_wallet"     | |
| mobile_wallet | {} | |
|               | .wallet_type  | [apply_pay, google_pay, samsung_pay] |
|               | .device_id | |
|               | .payment_token | |
|               | .card_last_for | |
| metadata      | {} | |
|               | .device_model | |
|               | .biometric_used | [face_id, touch_id, pin, pattern] |
| evidence[]    | {evidence_type: "tokenization", token_created#iso8601 } | |
|               | or {evidence_type: "device_authorization", auth_method[biometric, pin, pattern]} | |



## Wire Transfer

| Field         | Value     | REF/ENUM  |
| ------------  | --------- | ----------|
| type          | "wire_transfer"     | |
| wire_transfer | {}     | |
|               | .reference_number | |
|               | .swift_code | |
|               | .iban | |
|               | .itermediary_bank {name, swift_code} | |
| metadata      | {} | |
|               | .transfer_type | [domestic, international] | |
|               | .urgency | [standard, priority, express] | |
| evidence []   | { evidence_type: "wire_confirmation", confirmation_number} | |
|               | or {evidence_type: "bank_receipt", receipt_date #iso8601} | |


## Interac Transfer

| Field            | Value     | REF/ENUM  |
| ------------     | --------- | ----------|
| type             | "interac_transfer"   | |
| interac_transfer | {}        | |
|                  | .reference_number | |
|                  | .financial_institution | [RBC, TD, Scotiabank, BMO, CIBC, Desjardins, National Bank, other] |
|                  | .transfer_type | [email, mobile] |
|                  | .auto_deposit_enabled (bool) | |
|                  | .security_question | |
|                  | .recipient_email | |
|                  | .recipient_mobile | |
| metadata         | {} | |
|                  | .transfer_speed | [instant, 30_minutes, 1_hour, next_day ] |
|                  | .interac_fee (number) | |
|                  | .recipient_account_type | [checking, saving, uknown] | 
| evidence []      | { evidence_type: "transfer_confirmation" , confirmation_number, timestamp } | |
|                  | or { evidence_type: "deposit_notification", deposit_timestamp, recipient_bank} | |
|                  | or { evidence_type: "security_answer_attempt", attempt_timestamp, successful (bool) | |





## Check

| Field         | Value     | REF/ENUM  |
| ------------  | --------- | ----------|
| type          | "check"   | |
| check         | {}        | |
|               | .check_number | |
|               | .routing_number | |
|               | .account_number | |
|               | .payee_name | |
| metadata      | {}: PHYSICAL | |
|               | .check_sequence | [single, duplicate, triplicate | 
| evidence[]    | {evidence_type: "front_image", image_url } | |
|               | or {evidence_type: "back_image", endorsment } |



## Certified Check: BASE + ** CHECK ** 

| Field           | Value     | REF/ENUM  |
| ------------    | --------- | ----------|
| type            | "certified_check"   | |
| certified_check | {} | |
|                 | .certification_id  | |
|                 | .guarantee_date #iso8601  | |
|                 | .issuing_branch | |
| metadata        | {} | |
|                 | .guarantee_amount (num) | |


## Money Order

| Field           | Value     | REF/ENUM  |
| ------------    | --------- | ----------|
| type            | "moeny_order"   | |
| money_order     | {} | |
|                 | .serial_number | |
|                 | .issuer | [USPS, Western Union, MoneyGram, other] |
|                 | .purchase_location "" | |
|                 | .purchase_date #iso8601 | |
| metadata        | {}: PHYSICAL  | |
|                 | .receipt_available (bool) ||
| evidence []     | { evidence_type: "receipt_image", image_url} | |
|                 | or { evidence_type: "tracking_status", status, timestamp#iso8601} | |






## CRYPTO


| Field           | Value     | REF/ENUM  |
| ------------    | --------- | ----------|
| type            | "crypto"   | |
| crypto          | {} | |
|                 | .currency  |  [BTC, ETH, USDT, USDC, XRP, LTC, other] |
|                 | .wallet_address | |
|                 | .network | [ethereum, bitcoin, solana, ripple, other] |
| metadata        | {} | |
|                 | .exchange_name | |
|                 | .is_smart_contract(bool) | |
| evidence[]      | { evidence_type: "blockchain_proof", tx_hash, block_number } | |
|                 | or {evidence_type: "exchange_confrimation", confirmation_id} | |














