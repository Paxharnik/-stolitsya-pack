# Future integration adapters

This folder is intentionally small for the current MVP.

Planned adapters:

- `wayforpay_adapter.py` - create payment invoices and process payment callbacks.
- `nova_poshta_adapter.py` - search cities/branches and create TTN.
- `crm_adapter.py` - send orders to an external CRM when the store owner is ready.

Current implementation stores orders locally in SQLite and does not call external services.
