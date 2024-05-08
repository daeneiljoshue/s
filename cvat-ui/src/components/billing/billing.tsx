// PricingPlan.tsx

// PricingPlan.tsx

import React from 'react';

interface SubscriptionPlan {
  feature: string;
  solo: string | number;
  free: string | number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    feature: 'Automatic annotation on a task',
    solo: '∞',
    free: 'X',
  },
  {
    feature: 'Attached cloud storage limit',
    solo: '∞',
    free: 1,
  },
  // Add more subscription plans here
];

const PricingPlan = () => {
  return (
    <div className="pricing-plan">
      <h2>Choose the best plan for personal usage</h2>
      <table style={{ width: '50%' }}>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Solo Monthly</th>
            <th>Solo Annual</th>
            <th>Free</th>
          </tr>
        </thead>
        <tbody>
          {subscriptionPlans.map((plan) => (
            <tr key={plan.feature}>
              <td>{plan.feature}</td>
              <td>{plan.solo}</td>
              <td>${plan.solo} (Save 30%)</td> {/* Assuming annual price is solo price with a 30% discount */}
              <td>{plan.free}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Get started</button>
      <div className="comparison">
        <p>Comparison to Free plan</p>
        <a href="#">See details</a>
      </div>
      <p>
        <span>&#8595;</span> Got a question? Write us sales@annotationml.com
      </p>
    </div>
  );
};

export default PricingPlan;

