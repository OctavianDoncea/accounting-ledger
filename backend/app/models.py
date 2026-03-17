import uuid
from datetime import datetime
from sqlalchemy import Column, String, BigInteger, DateTime, ForeignKey, Enum, JSON, true
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .database import Base

class AccountType(str, enum.Enum):
    ASSET = 'ASSET'
    LIABILITY = 'LIABILITY'
    EQUITY = 'EQUITY'
    REVENUE = 'REVENUE'
    EXPENSE = 'EXPENSE'

class Direction(str, enum.Enum):
    DEBIT = 'DEBIT'
    CREDIT = 'CREDIT'

class Account(Base):
    __tablename__ = 'accounts'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    type = Column(Enum(AccountType), nullable=False)
    balance = Column(BigInteger, default=0, nullable=False)

    entries = relationship('LedgerEntry', back_populates='account')

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    description = Column(String, nullable=False)
    posted_at = Column(DateTime, default=datetime.now(datetime.timezone.utc), nullable=False)
    metadata_ = Column('metadata', JSON, default={})

    entries = relationship('LedgerEntry', back_populates='transaction', cascade='all, delete-orphan')

class LedgerEntry(Base):
    __tablename__ = 'ledger_entries'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey('transactions.id'), nullable=False)
    account_id = Column(UUID(as_uuid=True), ForeignKey('accounts.id'), nullable=False)
    amount = Column(BigInteger, nullable=False)
    direction = Column(Enum(Direction), nullable=False)

    transaction = relationship('Transaction', back_populates='entries')
    account = relationship('Account', back_populates='entries')