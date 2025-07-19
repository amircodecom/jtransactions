

transaction
  - id  ""
  - timestamp  #common.timestamps.defs.iso8601
  - status [pending, completed, failed, reversed, disputed]
  - reported_by [initiator, receiver, system]
  - initiator  #common.parties.defs.party
  - receiver   #common.parties.defs.party
  - instruments  {#} bank_account, check, certified_check, money_order, gift_card, credit_card, debit_card, p2p_app, pos, atm, crypto, mobile_wallet, wire_transfer
  - amount    #common.currency
  - location  #common.location
  - items []  { id, description*, sku, quantity*, unit_price*, tax#common.currency.defs.tax}
  - evidence [] oneof:#instruments.base.evidence#digital/physical
  - metadata {} purpose, reference, tags[""], risk_score

