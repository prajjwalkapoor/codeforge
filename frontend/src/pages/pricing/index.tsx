import { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { pricingPlans, faqs } from '@/constants/data';

export default function PricingPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            CodeForge Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xl text-gray-500 dark:text-gray-400">
            Choose the perfect plan for your coding needs. Unleash the power of
            CodeForge API.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between transition-all duration-300 ease-in-out ${
                plan.name === 'Pro' ? 'border-primary' : ''
              } ${hoveredPlan === plan.name ? 'scale-105 shadow-xl' : ''}`}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.name !== 'Enterprise' && (
                    <span className="text-xl font-medium">/month</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.name === 'Pro' ? 'default' : 'outline'}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="mx-auto max-w-2xl">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-24 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            Need More Information?
          </h2>
          <p className="mb-8 text-xl text-gray-500 dark:text-gray-400">
            Our team is here to answer any questions you may have about our
            pricing plans.
          </p>
          <Button size="lg" className="animate-pulse">
            <HelpCircle className="mr-2 h-5 w-5" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
