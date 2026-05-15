import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cloud,
  Zap,
  Shield,
  ArrowRight,
  Coffee,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 h-8 px-4 text-xs gap-2 border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Revolutionizing Cafe Printing
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Modern Printing for <br />
              <span className="text-primary">Modern Cafes.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Enable your customers to upload documents remotely via QR code. 
              No more messy wires or slow transfers—just instant, high-quality printing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base font-bold shadow-xl shadow-primary/20" asChild>
                <Link to="/signup">Get Started for Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-bold" asChild>
                <Link to="/login">Owner Login</Link>
              </Button>
            </div>
          </motion.div>

          {/* Product Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-[40px]" />
            <div className="glass rounded-[32px] p-2 border-white/20 shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2070" 
                alt="QuickPrint Dashboard" 
                className="rounded-[24px] w-full object-cover aspect-[16/9] opacity-80 grayscale-[0.2]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Speed and Security</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to manage document printing in a high-traffic environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Cloud, 
                title: 'Remote Upload', 
                desc: 'Customers scan a QR and upload files from their own devices without any app installation.' 
              },
              { 
                icon: Zap, 
                title: 'Real-time Sync', 
                desc: 'Owner dashboard updates instantly when a new file is uploaded. No refresh needed.' 
              },
              { 
                icon: Shield, 
                title: 'Secure Transmission', 
                desc: 'Files are processed through secure channels and deleted after printing to ensure privacy.' 
              }
            ].map((f, i) => (
              <Card key={i} className="border-none bg-background/50 hover:bg-background transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border-primary/20">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
             
             <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
               Ready to upgrade your <br /> cafe's printing experience?
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm font-medium text-muted-foreground">
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Free 14-day trial</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> No credit card required</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
             </div>
             <Button size="lg" className="h-14 px-10 text-lg font-black rounded-full" asChild>
               <Link to="/signup">Get Started Now</Link>
             </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
             <Coffee className="w-6 h-6 text-primary" />
             <span>QuickPrint</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-muted-foreground/60 font-bold tracking-widest">© 2026 QUICKPRINT INC.</p>
        </div>
      </footer>
    </div>
  );
}
