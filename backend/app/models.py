from sqlalchemy import Column, Integer, String
from app.database import Base


class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    family_info = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    home_style = Column(String, nullable=True)