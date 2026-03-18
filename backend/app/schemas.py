from pydantic import BaseModel, UUID4, field_validator
from typing import List, Optional
from datetime import datetime
from .models import AccountType, Direction

class AccountBase(BaseModel):
    name: str
    type: AccountType

class AccountCreate(AccountBase):
    pass

class AccountResponse(AccountBase):
    id: UUID4
    balance: int
    balance_display: str
    model_config = {'from_attributes': True}

    @property
    def balance_display(self) -> str:
        return f'${self.balance / 100:,.2f}'

class EntryCreate(BaseModel):
    account_id: UUID4
    amount: int
    direction: Direction

class TransactionCreate(BaseModel):
    description: str
    entries: List[EntryCreate]

    @field_validator('entries')
    @classmethod
    def must_have_two_or_more_entries(cls, v):
        if len(v) < 2:
            raise ValueError('A transaction must have at least 2 entries')
        
        return v

class LedgerEntryResponse(BaseModel):
    id: UUID4
    account_id: UUID4
    account_name: str
    amount: int
    direction: Direction
    model_config = {'from_attributes': True}

class TransactionResponse(BaseModel):
    id: UUID4
    description: str
    posted_at: datetime
    entries: List[LedgerEntryResponse]
    model_config = {'from_attributes': True}