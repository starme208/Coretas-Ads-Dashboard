import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, CheckCircle2, Globe, ShoppingCart, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeneratePlan, useExecutePlan } from "@/hooks/use-campaigns";
import { planInputSchema, type PlanInput, type GeneratedPlan } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const { toast } = useToast();

  const generatePlan = useGeneratePlan();
  const executePlan = useExecutePlan();

  const form = useForm<PlanInput>({
    resolver: zodResolver(planInputSchema),
    defaultValues: {
      dailyBudget: 50,
      objective: "Sales",
    }
  });

  const onSubmitStep1 = (data: any) => {
    generatePlan.mutate(data, {
      onSuccess: (generatedPlan) => {
        setPlan(generatedPlan);
        setStep(2);
      },
      onError: (error) => {
        toast({
          title: "Error generating plan",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleExecute = () => {
    if (!plan) return;
    executePlan.mutate(plan, {
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Campaigns created successfully.",
        });
        onOpenChange(false);
        setStep(1);
        setPlan(null);
        form.reset();
      },
      onError: () => {
        toast({
          title: "Execution failed",
          description: "Could not create campaigns. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-h-[800px] bg-background/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {step === 1 ? "AI Campaign Generator" : "Review Strategy"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Describe your goals and let our AI architect the perfect multi-channel strategy." 
              : "Review the proposed campaign structure before launching across platforms."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={form.handleSubmit(onSubmitStep1)}
              className="space-y-6 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="objective">Primary Objective</Label>
                  <Select 
                    onValueChange={(val) => form.setValue("objective", val as "Sales" | "Leads")}
                    defaultValue={form.getValues("objective")}
                  >
                    <SelectTrigger className="bg-white/50 border-gray-200">
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Maximize Sales</SelectItem>
                      <SelectItem value="Leads">Generate Leads</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.objective && <p className="text-destructive text-xs">{form.formState.errors.objective.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyBudget">Daily Budget ($)</Label>
                  <Input 
                    id="dailyBudget"
                    type="number"
                    className="bg-white/50 border-gray-200"
                    {...form.register("dailyBudget", { valueAsNumber: true })}
                  />
                  {form.formState.errors.dailyBudget && <p className="text-destructive text-xs">{form.formState.errors.dailyBudget.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productCategories">Product Categories / Keywords</Label>
                  <Textarea 
                    id="productCategories"
                    placeholder="e.g. Running Shoes, Athletic Wear, Summer Collection"
                    className="bg-white/50 border-gray-200 min-h-[100px]"
                    {...form.register("productCategories")}
                  />
                  <p className="text-xs text-muted-foreground">Separate categories with commas.</p>
                  {form.formState.errors.productCategories && <p className="text-destructive text-xs">{form.formState.errors.productCategories.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Target Country (Optional)</Label>
                  <Input 
                    id="country" 
                    placeholder="US" 
                    className="bg-white/50 border-gray-200"
                    {...form.register("country")} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language (Optional)</Label>
                  <Input 
                    id="language" 
                    placeholder="en" 
                    className="bg-white/50 border-gray-200"
                    {...form.register("language")} 
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={generatePlan.isPending}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {generatePlan.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Market Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.form>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 mt-4"
            >
              {plan && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" /> 
                      Global Strategy
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Daily Budget</span>
                        <span className="font-medium text-lg">${plan.daily_budget}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Objective</span>
                        <span className="font-medium text-lg">{plan.objective}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Bidding</span>
                        <span className="font-medium">{plan.bidding_strategy}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Regions</span>
                        <div className="flex gap-1 flex-wrap">
                          {plan.geo.map(g => <span key={g} className="px-1.5 py-0.5 bg-background rounded border text-xs">{g}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-3 text-blue-600">
                        <Globe className="h-5 w-5" />
                        <h4 className="font-bold">Google Ads</h4>
                      </div>
                      <div className="text-sm space-y-2">
                        <p className="font-medium">Performance Max</p>
                        <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Smart Bidding</li>
                          <li>Search & Display</li>
                          <li>YouTube Shorts</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-3 text-blue-700">
                        <Facebook className="h-5 w-5" />
                        <h4 className="font-bold">Meta Ads</h4>
                      </div>
                      <div className="text-sm space-y-2">
                        <p className="font-medium">Advantage+ Shopping</p>
                        <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Lookalike Audiences</li>
                          <li>Dynamic Creative</li>
                          <li>Instagram Reels</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-3 text-orange-500">
                        <ShoppingCart className="h-5 w-5" />
                        <h4 className="font-bold">Amazon</h4>
                      </div>
                      <div className="text-sm space-y-2">
                        <p className="font-medium">Sponsored Brands</p>
                        <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Category Targeting</li>
                          <li>Product Defense</li>
                          <li>Top of Search</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border bg-muted/30">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Generated Creatives</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium mb-1">Headlines</p>
                        <div className="space-y-1">
                          {plan.creative_pack.headlines.map((h, i) => (
                            <div key={i} className="p-2 bg-background rounded text-sm border border-border/50">{h}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1">Descriptions</p>
                        <div className="space-y-1">
                          {plan.creative_pack.descriptions.map((d, i) => (
                            <div key={i} className="p-2 bg-background rounded text-sm border border-border/50 truncate" title={d}>{d}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      Back to Input
                    </Button>
                    <Button 
                      onClick={handleExecute} 
                      disabled={executePlan.isPending}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white shadow-lg shadow-green-500/20"
                    >
                      {executePlan.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Launching Campaigns...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Create All
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
