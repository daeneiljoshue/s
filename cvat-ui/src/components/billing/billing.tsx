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
  {
    feature: 'Monthly AI calls in a job limit',
    solo: '∞',
    free: 100,
  },
  {
    feature: 'Exporting annotations with images for a job',
    solo: '✔', // Assuming a checkmark icon for Solo availability
    free: 'X',
  },
  {
    feature: 'Exporting annotations with images for a project',
    solo: '✔',
    free: 'X',
  },
  {
    feature: 'Created projects limit',
    solo: '∞',
    free: 3,
  },
  {
    feature: 'Exporting annotations with images for a task',
    solo: '✔',
    free: 'X',
  },
  {
    feature: 'Created tasks limit',
    solo: 10,
    free: 'X',
  },
  {
    feature: 'Created tasks in a project limit',
    solo: 5,
    free: 'X',
  },
  {
    feature: 'Project webhooks limit',
    solo: 10,
    free: 'X',
  },
];

const PricingPlan = () => {
  return (
    <div className="pricing-plan">
      <h2>Choose the best plan for you</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Solo</th>
            <th>Free</th>
          </tr>
        </thead>
        <tbody>
          {subscriptionPlans.map((plan) => (
            <tr key={plan.feature}>
              <td>{plan.feature}</td>
              <td>{typeof plan.solo === 'string' ? plan.solo : `$${plan.solo}`}</td> {/* Format solo value as currency if number */}
              <td>{plan.free === 'X' ? 'X' : plan.free}</td> {/* Display "X" or the actual free value */}
            </tr>
          ))}
        </tbody>
      </table>
      <button>Get started</button>
      {/* Add other sections like comparison and contact info as needed */}
    </div>
  );
};

export default PricingPlan;

