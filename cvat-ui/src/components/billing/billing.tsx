// PricingPlan.tsx

// PricingPlan.tsx

import React from 'react';

interface PricingPlanProps {
    name?: string; // Optional: You can remove this if not needed
    price?: number; // Optional: You can remove this if not needed
    description?: string; // Optional: You can remove this if not needed
    annualPrice?: number; // Optional: You can remove this if not needed
    solo?: boolean;
    free?: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
    name,
    price,
    description,
    annualPrice,
    solo,
    free,
}) => {
    return (
        <div className="pricing-plan">
            {name && <h2>{name}</h2>}
            {price && <p>Price: ${price} per month</p>}
            {description && <p>{description}</p>}
            {annualPrice && (
                <p>Annual Price: ${annualPrice} (Save 30%)</p>
            )}

            {solo !== undefined && free !== undefined && (
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Solo</th>
                            <th>Free</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Automatic annotation on a task</td>
                            <td>{solo ? '∞' : 'X'}</td>
                            <td>{free ? 'X' : '∞'}</td>
                        </tr>
                        {/* Add more features as needed */}
                    </tbody>
                </table>
            )}

            <p>
                Additional data for the invoice: Include address, phone number, VAT information.
            </p>

            <div className="contact-sales">
                <p>
                    For more information, contact sales via email.
                </p>
                {/* Add your email link or button here */}
            </div>
        </div>
    );
};

export default PricingPlan;
