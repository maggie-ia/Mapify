from app import db

class Membership(db.Model):
    __tablename__ = 'memberships'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.String(20), nullable=False)  # 'monthly', 'sixMonths', 'yearly'
    price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    @staticmethod
    def get_price(membership_type, duration):
        membership = Membership.query.filter_by(name=membership_type, duration=duration).first()
        return membership.price if membership else None