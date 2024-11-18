import { Code2, Zap, Shield, Globe, Server } from 'lucide-react';

export const features = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: 'Multi-Language Support',
    description:
      'Execute code in 40+ programming languages with real-time compilation and execution.'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Lightning Fast',
    description:
      'Powered by distributed infrastructure ensuring sub-second execution times.'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure Execution',
    description:
      'Sandboxed environments with strict resource limits and security protocols.'
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Global Edge Network',
    description:
      'Deployed across multiple regions for minimal latency worldwide.'
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: 'Scalable Infrastructure',
    description: 'Handle millions of requests with auto-scaling capabilities.'
  }
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      '50 executions/day',
      '5 concurrent requests',
      'Basic languages support',
      'Community support'
    ]
  },
  {
    name: 'Pro',
    price: '$49',
    features: [
      '10,000 executions/day',
      '50 concurrent requests',
      'All languages support',
      'Priority support',
      'Custom timeout limits'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited executions',
      'Unlimited concurrent requests',
      'Custom deployment options',
      '24/7 dedicated support',
      'SLA guarantees'
    ]
  }
];

export const faqs = [
  {
    question: "What is an 'execution' in the context of CodeForge?",
    answer:
      'An execution refers to a single run of your code through our API. Each time you send code to be processed, it counts as one execution.'
  },
  {
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer:
      'Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.'
  },
  {
    question: "What happens if I exceed my plan's limits?",
    answer:
      "If you exceed your plan's execution or concurrent request limits, additional requests will be queued or temporarily blocked. We recommend upgrading your plan if you consistently reach these limits."
  },
  {
    question: 'Do unused executions roll over to the next day?',
    answer:
      'No, unused executions do not roll over. The execution count resets daily.'
  }
];
