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

# Precios actualizados
def update_prices():
    new_prices = [
        ('basic', 'monthly', 6.99),
        ('basic', 'sixMonths', 34.99),
        ('basic', 'yearly', 59.99),
        ('premium', 'monthly', 13.99),
        ('premium', 'sixMonths', 69.99),
        ('premium', 'yearly', 119.99)
    ]
    
    for name, duration, price in new_prices:
        membership = Membership.query.filter_by(name=name, duration=duration).first()
        if membership:
            membership.price = price
        else:
            new_membership = Membership(name=name, duration=duration, price=price)
            db.session.add(new_membership)
    
    db.session.commit()

# Llamar a esta función después de inicializar la base de datos
# update_prices()