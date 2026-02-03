'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LandingHeader } from '@/components/layouts/LandingHeader';
import { Hero } from '@/components/landing/Hero';
import { WaitlistForm } from '@/components/landing/WaitlistForm';
import { Footer } from '@/components/layouts/Footer';
import { Sparkles, BarChart3, DollarSign, ArrowRight, CheckCircle2, TrendingUp, Zap, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <LandingHeader />
      
      {/* SECTION 1: HERO */}
      <Hero />
      
      {/* SECTION 2: FEATURES (3 Cards) */}
        <section id="features" className="relative py-24 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-100 font-display">
                Pricing Intelligence auf Autopilot
              </h2>
              <p className="text-xl text-slate-400 text-center mb-16 max-w-3xl mx-auto">
                Während du schläfst, analysiert <span className="font-bold text-slate-200">vlerafy</span> den Markt und optimiert deine Preise
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'KI-Preisempfehlungen',
                  desc: 'Trainiert mit 500K+ historischen Daten. 1 perfekter Preis.',
                },
                {
                  icon: BarChart3,
                  title: 'Echtzeit-Marktanalyse',
                  desc: 'Deine Top-Konkurrenten im Blick – automatisch.',
                },
                {
                  icon: DollarSign,
                  title: 'Margen-Optimierung',
                  desc: 'Maximiere Gewinn ohne Umsatz zu verlieren.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all hover:bg-slate-900 hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-800/50 hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">
                    <feature.icon className="w-12 h-12 text-slate-400 group-hover:text-slate-300 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-slate-100">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700/0 to-slate-800/0 group-hover:from-slate-700/10 group-hover:to-slate-800/10 transition-all pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ SECTION 3: BENEFITS - WAS BRINGT ES? */}
        <section className="relative py-24 px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Was bringt dir vlerafy?
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Echte Shops erzielen im Durchschnitt <span className="text-white font-semibold">+24% mehr Umsatz</span> nach 30 Tagen
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-indigo-400" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  +24% mehr Umsatz
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Automatische Preisoptimierung basierend auf 80+ Marktfaktoren steigert deinen Umsatz nachweislich.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Echtzeit-Wettbewerbsanalyse</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Nachfrage-basierte Anpassungen</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Saisonale Trends berücksichtigt</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Benefit 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-purple-400" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  100% Automatisch
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Einmal einrichten, dann läuft alles automatisch. Preise werden kontinuierlich optimiert.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Automatische Preisanpassungen</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>24/7 Marktbeobachtung</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Sofortige Benachrichtigungen</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Benefit 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-7 h-7 text-emerald-400" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  Für jeden Shop
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Egal ob Fashion, Elektronik oder Lifestyle – vlerafy funktioniert für jede Produktkategorie.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Alle Produktkategorien</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Shopify-native Integration</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Setup in unter 5 Minuten</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ✅ SECTION 4: SOCIAL PROOF - ECHTE ZAHLEN */}
        <section className="relative py-20 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-4 gap-8"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-sm text-slate-500">Aktive Shops</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">12K+</div>
                <div className="text-sm text-slate-500">Produkte optimiert</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">€2.5M+</div>
                <div className="text-sm text-slate-500">Zusätzlicher Umsatz</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24%</div>
                <div className="text-sm text-slate-500">Ø Umsatzsteigerung</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: HOW IT WORKS (Timeline) */}
        <section className="relative py-24 px-6 bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-100 font-display">So funktioniert's</h2>
              <p className="text-xl text-slate-400">
                In 3 einfachen Schritten zu optimierten Preisen
              </p>
            </motion.div>

            <div className="flex items-center justify-center gap-6 md:gap-12 max-w-6xl mx-auto flex-wrap md:flex-nowrap">
              {[
                {
                  step: '1',
                  title: 'Shopify verbinden',
                  desc: 'Verbinde deinen Shopify-Shop in weniger als 2 Minuten. Keine technischen Kenntnisse nötig.',
                },
                {
                  step: '2',
                  title: 'KI analysiert',
                  desc: 'Unsere KI analysiert deine Verkaufsdaten, Konkurrenten-Preise und Markttrends in Echtzeit.',
                },
                {
                  step: '3',
                  title: 'Preise optimieren',
                  desc: 'Erhalte täglich neue Preisempfehlungen. Ein Klick genügt, um sie anzuwenden.',
                },
              ].map((item, i) => (
                <React.Fragment key={i}>
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Number Circle */}
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-6 mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-slate-100">{item.step}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center md:text-left">
                    <h3 className="text-lg md:text-2xl font-bold text-slate-100 mb-2">{item.title}</h3>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
                
                {/* Arrow Connector (not after last step) */}
                {i < 2 && (
                  <div className="hidden md:flex items-center justify-center pt-8 pb-16">
                    <ArrowRight className="w-8 h-8 text-slate-600" />
                  </div>
                )}
              </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: WAITLIST (Fancy CTA) */}
        <section
          id="waitlist"
          className="relative py-32 px-6 bg-slate-950"
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-100 font-display">
                Bereit loszulegen?
              </h2>
              <p className="text-xl text-slate-400 mb-12">
                Tritt der Waitlist bei und sei einer der Ersten, die Zugang zu 
                KI-Preisoptimierung erhalten.
              </p>

              {/* Waitlist Form Box */}
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm mb-12">
                <WaitlistForm />
              </div>

              {/* Check Items */}
              <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Kostenlos während Beta</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Keine Kreditkarte nötig</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Früher Zugang</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      <Footer />
    </div>
  );
}
