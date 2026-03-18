from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Transaction, LedgerEntry
from ..schemas import TransactionCreate, TransactionResponse

router = APIRouter(prefix='/transactions', tags=['transactions'])

@router.post('/', response_model=TransactionResponse, status_code=201)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    total_debits = sum(e.amount for e in payload.entries if e.direction == 'DEBIT')
    total_credits = sum(e.amount for e in payload.entries if e.direction == 'CREDIT')

    if total_debits != total_credits:
        raise HTTPException(
            status_code=400,
            detail=f'Transaction out of balance. '
                   f'Debits: ${total_debits / 100:.2f}, '
                   f'Credits: ${total_credits / 100:.2f}'
        )

    try:
        transaction = Transaction(description=payload.description)
        db.add(transaction)
        db.flush()

        for entry_data in payload.entries:
            entry = LedgerEntry(transaction_id=transaction.id, **entry_data.model_dump())
            db.add(entry)

        db.commit()
        db.refresh(transaction)

        return transaction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))