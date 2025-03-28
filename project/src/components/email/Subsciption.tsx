import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Html,
    //Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from '@react-email/components';

interface SubscriptionEmailProps {
    email: string;
}

export const SubscriptionEmail: React.FC<Readonly<SubscriptionEmailProps>> = ({
    email,
}) => (
    <Html>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              "df-text": "#33311d",
              "df-bg": "#eee4d1",
              "dfNew": "#2b2340",
              "dfNew2": "#dfd1ee",
            }
          }
        }
      }}
    >
    <Head />
    <Preview>Welcome to Bikini Grad School!</Preview>
    <Body className="bg-white">
      <Container className="bg-dfNew2">
        <Section className="p-12">
          <Text className="text-df-text text-2xl">
            Welcome to Bikini Grad School, {email}!
          </Text>
          <Hr />
          <Text className="text-df-text text-xl">
          THANKS FOR SIGNING UP FOR THE NEWSLETTER. YOU WILL NOW RECEIVE UPDATES FOR BIKINI GRAD SCHOOL.
          </Text>
          <Button className="inline-flex items-center justify-center px-5 py-3 mr-3
            text-center text-white w-full rounded-lg bg-dfNew"
            href="https://bikinigradschool.com/shop">
            Shop Now
          </Button>
        </Section>
      </Container>
    </Body>
    </Tailwind>
  </Html>
);
