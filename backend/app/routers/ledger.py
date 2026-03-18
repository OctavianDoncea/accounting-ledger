from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import LedgerEntry, Transaction
from ..schemas import TransactionResponse
from typing import List

router = APIRouter(prefix='/ledger', response_model=List[TransactionResponse])
def get_ledger(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    transactions = (db.query(Transaction)
        .options(joinedload(Transaction.entries).joinedload(LedgerEntry.account))
        .order_by(Transaction.posted_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return transactions