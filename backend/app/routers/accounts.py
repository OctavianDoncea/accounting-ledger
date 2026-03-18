from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Account, LedgerEntry, Direction
from ..schemas import AccountCreate, AccountResponse
from typing import List

router = APIRouter(prefix='/accounts', tags=['accounts'])

@router.get('/', response_model=List[AccountResponse])
def get_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    result = []

    for acc in accounts:
        # Live balance from ledger entries
        debits = db.query(func.sum(LedgerEntry.amount)).filter(
            LedgerEntry.account_id == acc.id,
            LedgerEntry.direction == Direction.DEBIT
        ).scalar() or 0
        credits = db.query(func.sum(LedgerEntry.amount)).filter(
            LedgerEntry.account_id == acc.id,
            LedgerEntry.direction == Direction.CREDIT
        ).scalar() or 0
        acc.balance = debits - credits
        result.append(acc)

    return result

@router.post('/', response_model=AccountResponse, status_code=201)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    db_account = Account(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    
    return db_account