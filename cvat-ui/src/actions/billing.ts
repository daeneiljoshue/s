// SubscriptionPlans.ts

// Define the subscription plan interface
interface SubscriptionPlan {
    feature: string;
    solo: string | number;
    free: string | number;
}

// Define the subscription plans
const subscriptionPlans: SubscriptionPlan[] = [
    {
        feature: "Automatic annotation on a task",
        solo: "∞",
        free: "X",
    },
    {
        feature: "Attached cloud storage limit",
        solo: "∞",
        free: 1,
    },
    {
        feature: "Monthly AI calls in a job limit",
        solo: "∞",
        free: 100,
    },
    {
        feature: "Exporting annotations with images for a job",
        solo: "X",
        free: "X",
    },
    {
        feature: "Created projects limit",
        solo: "∞",
        free: 3,
    },
];

// Export the subscription plans
export default subscriptionPlans;
