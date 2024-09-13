import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { plansMap } from "@/lib/constants";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
  paymentLink: string;
}

const plans: PlanProps[] = plansMap.map(plan => ({
  title: plan.name,
  popular: PopularPlan.NO, // Assuming all plans are not popular by default
  price: Number(plan.price),
  description: plan.description,
  buttonText: 'Subscribe', // Assuming the button text is the same for all plans
  benefitList: plan.items,
  paymentLink: plan.paymentLink,
}));

export const PricingSection = () => {
  return (
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Get unlimited access
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Lorem ipsum dolor sit amet consectetur adipisicing reiciendis.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 justify-center mx-auto">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList, paymentLink }) => (
            <Card
              key={title}
              className={cn(
                popular === PopularPlan.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : "",
                "transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1 hover:shadow-lg hover:transition-delay-150"
              )}
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>
                <CardDescription className="pb-4">{description}</CardDescription>
                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col space-y-4">
                {benefitList.map((benefit) => (
                  <span key={benefit} className="flex items-center">
                    <Check className="text-primary mr-2" />
                    <span>{benefit}</span>
                  </span>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  variant={popular === PopularPlan.YES ? "default" : "secondary"}
                  className="w-full flex items-center justify-center"
                >
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 items-center"
                  >
                    {buttonText}
                    <ArrowRight size={18} />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
