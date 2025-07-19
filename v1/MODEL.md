

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

Intruments (type): bank_account, check, certified_check, money_order, gift_card, credit_card, debit_card, p2p_app, pos, atm, crypto, mobile_wallet, wire_transfer, interac_transfer, forign_remittance, MSB

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
|                  | .contact_used | [email, mobile] |
|                  | .recipient_email | |
|                  | .recipient_mobile | |
|                  | .auto_deposit_enabled (bool) | |
|                  | .security_question | |
|                  | .security_answer_attempts | |

| metadata         | {} | |
|                  | .transfer_speed | [instant, 30_minutes, 1_hour, next_day ] |
|                  | .interac_fee (number) | |
|                  | .recipient_account_type | [checking, saving, uknown] | 
|                  | .notification_preferences {email_alert(bool), sms_alert(bool)} | |
| evidence []      | { evidence_type: "transfer_confirmation" , confirmation_number, timestamp } | |
|                  | or { evidence_type: "deposit_notification", deposit_timestamp, recipient_bank} | |
|                  | or { evidence_type: "security_answer_attempt", attempt_timestamp, successful (bool), ip_address | |
|                  | or { evidence_type: "auto_deposit_registration", registration_date, verified(bool) }





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



## MSB Transfer (Wester Union/MoneyGram)

| Field           | Value           | REF/ENUM  |
| ------------    | ----------------| |
| type            | "msb_transfer"  | |
| msb_transfer    | {}              | |
|                 | .provider       | [Western Union | MoneyGram | Ria | Small World | Other ] |
|                 | .transaction_number | |
|                 | .sender_details { full_name, address, phone, id_type [passport, driver_license, national_id, other], id_number, id_issuing_country, date_of_birth, } | |
|                 | .recipient_details { full_name, country, contact_phone, payout_city, relationship_to_sender [family, friend, business_associate, other]} | |
|                 | .payout_method | [cash_pickup, bank_deposit, mobile_wallet, home_delivery] |
|                 | .payout_currency | |
|                 | .exchange_rate | |
|                 | .expected_payout_amount | |
| metadata        | {}  | |
|                 | .regulatory_compliance { aml_check (bool), ctr_filed (bool), sender_ssn, purpose_code [family_support, business, gift, education, medical, other]} | |
|                 | .transfer_speed | [instance, 1_hour, same_ady, next_day ] |
|                 | .fees { transfer_fee, currency_conversion_fee, payout_location_feed} | |
| evidence[]      | { evidence_type: send_receipt, receipt_number, control_number, timstamp, agent_id} | |
|                 | or { evidence_type: id_verification, id_type, country_issued, verification_method [in_person, digital, document_upload]} | |
|                 | or { evidence_type: payout_confirmation, payout_location, payout_timestamp, collector_id_type, collector_id_number } | |



## Foreign Remittance
| Field           | Value                 | REF/ENUM  |
| ------------------| ----------------------| |
| type              | "foreign_remittance"  | |
| forign_remittance | {} | |
|                   | .remittance_reference | |
|                   | .corridor "" | |
|                   | .handler_type | [bank, fintech, mobile_network, post_office, credit_union, specialized_remitter] |
|                   | .handler_name | e.g. remitly, wise, bank of america global remit |
|                   | .sender_origin_party | |
|                   | .receiver_destination_country  | |
|                   | .transfer_purpose | [family_support, education, medical, living_expenses, other] 
|                   | .source_of_funds | [salary, savings, business_income, investments, other] |
|                   | .relationship_proof | [documented, declared, verified, none] |
| metadata          | {} | |
|                   | .compliance { fatca_reporable (bool), crs_applie (bool), tax_treaty_article, immigration_related(bool) } |
|                   | .fx_details { mid_market_rate, applied_rate, rate_margin_percent } | |
| evidence          | { evidence_type: sender_id_verificcation, id_type, country_issued } | |
|                   | or { evidence_type: relationship_document, document_type [birth_certificate, marriage_certificate, affidavit, other], issuing_authority } | |
|                   | or { evidence_type: handler_confirmation, confirmation_id, handler_contact } 


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










#### MORE?
Here are additional instrument types that could be valuable additions to your financial transaction schema:

1. **Loyalty Points** - Tracks redemption/earnings from reward programs  
2. **Bill Payment** - Formal bill payments through banking institutions  
3. **ADDED - Money Service Business (MSB)** - Western Union/MoneyGram cash transfers  
4. **Crypto Exchange** - Trading between crypto/fiat currencies  
5. **Payroll Card** - Employer-issued prepaid wage cards  
6. **Health Savings Account (HSA)** - Medical expense payment instrument  
7. **Government Checks** - Tax refunds/stimulus payments  
8. **Escrow Account** - Held funds for real estate/legal transactions  
9. **Crowdfunding** - Kickstarter/GoFundMe style transfers  
10. **ADDED - Foreign Remittance** - International family support transfers  
11. **Corporate Travel Card** - Company-issued expense cards  
12. **Prepaid Debit** - Non-bank reloadable debit cards  
13. **Gaming Credits** - Casino chips/in-game currencies  
14. **Microfinance** - Small loan disbursements/repayments  
15. **Subscription Billing** - Recurring SaaS/media payments  
16. **Tax Payment** - IRS/CRA direct remittances  
17. **Tuition Payment** - Educational institution payments  
18. **Royalty Payment** - Content creator/artist distributions  
19. **Insurance Payout** - Claim settlement transfers  
20. **Dividend Distribution** - Investment earnings payments  

Each would follow the same pattern we established (base fields + type-specific details + metadata + evidence). Would you like me to develop any of these further?





