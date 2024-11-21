import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import NavLaout from '@/components/layout/nav-layout';

const CodeRunnerSLA = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderServiceLevels = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary">
        Service Availability
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Monthly Uptime</TableHead>
            <TableHead>Service Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Basic & Pro Plans</TableCell>
            <TableCell>99.5%</TableCell>
            <TableCell>
              <Badge variant="secondary">10% Credit</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Enterprise Plan</TableCell>
            <TableCell>99.9%</TableCell>
            <TableCell>
              <Badge variant="secondary">25% Credit</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Custom Enterprise</TableCell>
            <TableCell>Up to 99.99%</TableCell>
            <TableCell>
              <Badge variant="secondary">Custom Credit</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  const renderSupportTiers = () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="email-support">
        <AccordionTrigger>Email Support Tiers</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Free Tier</TableCell>
                <TableCell>Community Support</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Basic Plan</TableCell>
                <TableCell>{`< 24 hours`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pro Plan</TableCell>
                <TableCell>{`< 12 hours`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Enterprise Plan</TableCell>
                <TableCell>{`< 4 hours`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="priority-support">
        <AccordionTrigger>Priority Support</AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">
            Enterprise and Custom Enterprise plans offer priority support with
            faster response times for critical issues.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <NavLaout>
      <div className="dark min-h-screen bg-background py-10 text-foreground">
        <div className="container mx-auto max-w-6xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">
                Codeforge- Service Level Agreement
              </CardTitle>
              <CardDescription>
                Version 1.0 | Effective: December 1, 2024
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6 grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="service-levels">
                    Service Levels
                  </TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Agreement Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This Service Level Agreement outlines the service
                        commitments, performance metrics, and remedies provided
                        by CodeRunner Pro for our code execution platform
                        services.
                      </p>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardHeader>
                            <CardTitle>Availability</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>Up to 99.99% monthly uptime</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Response Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>As low as 500ms for Enterprise plans</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Support</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>24/7 support for Enterprise customers</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="service-levels">
                  {renderServiceLevels()}
                </TabsContent>

                <TabsContent value="support">
                  {renderSupportTiers()}
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Commitments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc space-y-2 pl-5">
                        <li>Encryption at rest and in transit</li>
                        <li>Regular security audits</li>
                        <li>Quarterly penetration testing</li>
                        <li>ISO 27001 standards adherence</li>
                        <li>GDPR compliance</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold">
                            Support Channels
                          </h4>
                          <ul>
                            <li>Technical Support: support@coderunner.pro</li>
                            <li>Emergency: emergency@coderunner.pro</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold">Other Contacts</h4>
                          <ul>
                            <li>Security Issues: security@coderunner.pro</li>
                            <li>Billing Questions: billing@coderunner.pro</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavLaout>
  );
};

export default CodeRunnerSLA;
