import { PaymentMethod } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateOrder } from "@/hooks/useQueries";
import {
  CheckCircle,
  ChevronRight,
  Diamond,
  Gamepad2,
  Menu,
  MessageCircle,
  Shield,
  Star,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Data ────────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: "freefire",
    name: "Free Fire",
    emoji: "🔥",
    subtitle: "Instant Top-Up",
  },
  { id: "pubg", name: "PUBG Mobile", emoji: "🎯", subtitle: "Instant Top-Up" },
  { id: "ml", name: "Mobile Legends", emoji: "⚔️", subtitle: "Instant Top-Up" },
  { id: "cod", name: "Call of Duty", emoji: "💥", subtitle: "Instant Top-Up" },
  { id: "valorant", name: "Valorant", emoji: "🎮", subtitle: "Instant Top-Up" },
  {
    id: "genshin",
    name: "Genshin Impact",
    emoji: "✨",
    subtitle: "Instant Top-Up",
  },
];

const FF_PACKAGES = [
  { id: 1n, name: "Starter Pack", diamonds: 100n, priceBDT: 95n },
  { id: 2n, name: "Value Pack", diamonds: 310n, priceBDT: 285n },
  {
    id: 3n,
    name: "Best Value",
    diamonds: 520n,
    priceBDT: 475n,
    featured: true,
  },
  { id: 4n, name: "Pro Pack", diamonds: 1060n, priceBDT: 960n },
  { id: 5n, name: "Elite Pack", diamonds: 2180n, priceBDT: 1950n },
];

const PUBG_PACKAGES = [
  { id: 6n, name: "Starter UC", diamonds: 60n, priceBDT: 90n },
  { id: 7n, name: "Value UC", diamonds: 180n, priceBDT: 270n },
  {
    id: 8n,
    name: "Best Value UC",
    diamonds: 325n,
    priceBDT: 480n,
    featured: true,
  },
  { id: 9n, name: "Pro UC", diamonds: 660n, priceBDT: 960n },
  { id: 10n, name: "Elite UC", diamonds: 1800n, priceBDT: 2600n },
];

const TESTIMONIALS = [
  {
    name: "Rafi Ahmed",
    location: "Dhaka, Bangladesh",
    text: "Super fast delivery! Got my Free Fire diamonds within 2 minutes. Bobtopup is my go-to for all game top-ups.",
    rating: 5,
  },
  {
    name: "Tanvir Hasan",
    location: "Chittagong, Bangladesh",
    text: "Been using Bobtopup for 6 months. Never had any issues. bKash payment works perfectly every time.",
    rating: 5,
  },
];

const NAV_LINKS = ["Home", "Games", "How to Top Up", "Support"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof FF_PACKAGES)[0] | null
  >(null);
  const [playerId, setPlayerId] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<
    "bKash" | "nagad" | null
  >(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [gameTab, setGameTab] = useState<"freefire" | "pubg">("freefire");

  const createOrder = useCreateOrder();
  const currentPackages = gameTab === "freefire" ? FF_PACKAGES : PUBG_PACKAGES;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleSelectPackage = (pkg: (typeof FF_PACKAGES)[0]) => {
    setSelectedPackage(pkg);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitOrder = async () => {
    if (!playerId.trim()) {
      toast.error("Please enter your Player ID");
      return;
    }
    if (!selectedPackage) {
      toast.error("Please select a package");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    try {
      await createOrder.mutateAsync({
        playerId: playerId.trim(),
        game: gameTab === "freefire" ? "Free Fire" : "PUBG Mobile",
        packageId: selectedPackage.id,
        paymentMethod:
          selectedPayment === "bKash"
            ? PaymentMethod.bKash
            : PaymentMethod.nagad,
      });
      setOrderSuccess(true);
      toast.success(
        "Order placed successfully! You will receive your top-up shortly.",
      );
      setPlayerId("");
      setSelectedPackage(null);
      setSelectedPayment(null);
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster position="top-right" />

      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-border"
        style={{
          background: "oklch(0.09 0.022 285 / 0.9)",
          backdropFilter: "blur(12px)",
        }}
        data-ocid="nav.panel"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Bobtopup
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => scrollTo(link.toLowerCase().replace(/ /g, "-"))}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                data-ocid="nav.link"
              >
                {link}
              </button>
            ))}
            <Button
              size="sm"
              className="rounded-full px-5 bg-primary hover:bg-accent shadow-glow-purple-sm"
              data-ocid="nav.primary_button"
            >
              Sign Up
            </Button>
          </nav>
          <button
            type="button"
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
              style={{ background: "oklch(0.09 0.022 285 / 0.98)" }}
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link}
                    type="button"
                    onClick={() =>
                      scrollTo(link.toLowerCase().replace(/ /g, "-"))
                    }
                    className="text-muted-foreground hover:text-foreground text-sm font-medium py-2 text-left transition-colors"
                    data-ocid="nav.link"
                  >
                    {link}
                  </button>
                ))}
                <Button
                  className="rounded-full bg-primary hover:bg-accent shadow-glow-purple-sm mt-2"
                  data-ocid="nav.primary_button"
                >
                  Sign Up
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.09 0.022 285 / 0.85) 0%, oklch(0.12 0.04 285 / 0.7) 50%, oklch(0.09 0.022 285 / 0.9) 100%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.52 0.26 292 / 0.15) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-primary/20 text-accent border-primary/30">
              🇧🇩 Bangladesh's #1 Gaming Top-Up
            </Badge>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-foreground leading-none mb-6">
              BOBTOPUP:
              <span
                className="block"
                style={{
                  color: "oklch(0.61 0.27 293)",
                  textShadow: "0 0 40px oklch(0.52 0.26 292 / 0.6)",
                }}
              >
                FAST &amp; SECURE
              </span>
              TOP-UP
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-medium">
              Instant game currency delivery for Bangladesh gamers. Free Fire
              Diamonds, PUBG UC &amp; more — in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollTo("packages")}
                className="rounded-full px-10 py-6 text-base font-bold bg-primary hover:bg-accent shadow-glow-purple transition-all duration-300 hover:scale-105"
                data-ocid="hero.primary_button"
              >
                Start Top-Up Now <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("how-to-top-up")}
                className="rounded-full px-10 py-6 text-base font-bold border-border hover:border-primary hover:bg-primary/10"
                data-ocid="hero.secondary_button"
              >
                How It Works
              </Button>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8">
              {[
                { label: "Orders Completed", value: "50,000+" },
                { label: "Happy Gamers", value: "15,000+" },
                { label: "Avg. Delivery", value: "< 2 min" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.61 0.27 293)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Popular Games ──────────────────────────────────────────────── */}
      <section id="games" className="py-24 relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.52 0.26 292 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
              Top-Up Available
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-foreground">
              Popular Games
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {GAMES.map((game, i) => (
              <motion.button
                key={game.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group w-full text-left"
                onClick={() => {
                  if (game.id === "freefire") setGameTab("freefire");
                  else if (game.id === "pubg") setGameTab("pubg");
                  scrollTo("packages");
                }}
                data-ocid={`games.item.${i + 1}`}
              >
                <div
                  className="rounded-2xl p-5 flex flex-col items-center gap-3 border border-border transition-all duration-300 group-hover:border-primary/50 shadow-card-dark h-full"
                  style={{ background: "oklch(0.15 0.028 285)" }}
                >
                  <div className="text-5xl">{game.emoji}</div>
                  <div className="text-center">
                    <div className="font-semibold text-sm text-foreground">
                      {game.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {game.subtitle}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Diamond Packages ───────────────────────────────────────────── */}
      <section id="packages" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
              Choose Your Bundle
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-foreground">
              Diamond Packages
            </h2>
            <p className="text-muted-foreground mt-3">
              Select Your Package &amp; Top Up Instantly
            </p>
          </motion.div>
          <div
            className="rounded-3xl p-6 md:p-10 border border-border"
            style={{ background: "oklch(0.12 0.03 285)" }}
          >
            <Tabs
              value={gameTab}
              onValueChange={(v) => setGameTab(v as "freefire" | "pubg")}
            >
              <TabsList
                className="mb-8 mx-auto flex w-fit rounded-full p-1"
                style={{ background: "oklch(0.17 0.032 285)" }}
              >
                <TabsTrigger
                  value="freefire"
                  className="rounded-full px-6 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white"
                  data-ocid="packages.tab"
                >
                  🔥 Free Fire
                </TabsTrigger>
                <TabsTrigger
                  value="pubg"
                  className="rounded-full px-6 py-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white"
                  data-ocid="packages.tab"
                >
                  🎯 PUBG Mobile
                </TabsTrigger>
              </TabsList>
              {(["freefire", "pubg"] as const).map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(tab === "freefire" ? FF_PACKAGES : PUBG_PACKAGES).map(
                      (pkg, i) => {
                        const isFeatured = (pkg as { featured?: boolean })
                          .featured;
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <motion.div
                            key={String(pkg.id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            data-ocid={`packages.item.${i + 1}`}
                          >
                            <button
                              type="button"
                              className="relative w-full rounded-2xl p-5 flex flex-col items-center gap-3 border-2 transition-all duration-300 hover:scale-105"
                              style={{
                                background: "oklch(0.15 0.028 285)",
                                borderColor: isSelected
                                  ? "oklch(0.61 0.27 293)"
                                  : isFeatured
                                    ? "oklch(0.45 0.26 292)"
                                    : "oklch(0.22 0.05 285)",
                                boxShadow: isFeatured
                                  ? "0 0 24px oklch(0.52 0.26 292 / 0.3)"
                                  : undefined,
                              }}
                              onClick={() =>
                                handleSelectPackage(
                                  pkg as (typeof FF_PACKAGES)[0],
                                )
                              }
                            >
                              {isFeatured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                  <Badge className="bg-primary text-white text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wide shadow-glow-purple-sm">
                                    POPULAR
                                  </Badge>
                                </div>
                              )}
                              <div className="text-4xl mt-1">
                                {tab === "freefire" ? "💎" : "🪙"}
                              </div>
                              <div className="text-center">
                                <div className="font-display font-bold text-2xl text-foreground">
                                  {String(pkg.diamonds)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {tab === "freefire" ? "Diamonds" : "UC"}
                                </div>
                              </div>
                              <div
                                className="font-bold text-lg"
                                style={{ color: "oklch(0.61 0.27 293)" }}
                              >
                                {String(pkg.priceBDT)} BDT
                              </div>
                              <span
                                className="w-full rounded-full bg-primary hover:bg-accent text-xs font-bold py-1.5 px-3 text-center text-white mt-1"
                                data-ocid={`packages.primary_button.${i + 1}`}
                              >
                                Select
                              </span>
                            </button>
                          </motion.div>
                        );
                      },
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* ─── How To Top Up ──────────────────────────────────────────────── */}
      <section
        id="how-to-top-up"
        className="py-24"
        style={{ background: "oklch(0.11 0.025 285)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-foreground">
              How to Top Up
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                icon: "🎮",
                title: "Choose Your Game",
                desc: "Pick your game and select the diamond or UC package you want.",
              },
              {
                step: "02",
                icon: "📱",
                title: "Enter Player ID",
                desc: "Fill in your in-game Player ID so we know where to send your top-up.",
              },
              {
                step: "03",
                icon: "⚡",
                title: "Pay & Receive",
                desc: "Pay via bKash or Nagad. Your diamonds arrive in under 2 minutes!",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="relative rounded-2xl p-8 border border-border text-center"
                style={{ background: "oklch(0.15 0.028 285)" }}
                data-ocid={`howto.item.${idx + 1}`}
              >
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display border-2 border-primary"
                  style={{
                    background: "oklch(0.09 0.022 285)",
                    color: "oklch(0.61 0.27 293)",
                  }}
                >
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-3">{item.icon}</div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Order Form ─────────────────────────────────────────────────── */}
      <section id="order" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
              Complete Your Purchase
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-foreground">
              Order Details
            </h2>
          </motion.div>
          <div
            className="max-w-4xl mx-auto rounded-3xl p-6 md:p-10 border border-border"
            style={{ background: "oklch(0.12 0.03 285)" }}
          >
            <AnimatePresence mode="wait">
              {orderSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                  data-ocid="order.success_state"
                >
                  <CheckCircle
                    className="w-20 h-20 mx-auto mb-4"
                    style={{ color: "oklch(0.72 0.2 145)" }}
                  />
                  <h3 className="font-display text-3xl font-bold text-foreground mb-2">
                    Order Placed!
                  </h3>
                  <p className="text-muted-foreground">
                    Your top-up is being processed. You'll receive it within 2
                    minutes.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Player Details */}
                    <div className="space-y-5">
                      <h3 className="font-display font-bold text-xl text-foreground">
                        Player Details
                      </h3>
                      <div className="space-y-2">
                        <label
                          htmlFor="player-id"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Player ID
                        </label>
                        <Input
                          id="player-id"
                          placeholder="Enter your Player ID (e.g. 123456789)"
                          value={playerId}
                          onChange={(e) => setPlayerId(e.target.value)}
                          className="bg-input border-border focus:border-primary h-12 rounded-xl"
                          data-ocid="order.input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="game-select"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Select Game
                        </label>
                        <Select
                          value={gameTab}
                          onValueChange={(v) =>
                            setGameTab(v as "freefire" | "pubg")
                          }
                        >
                          <SelectTrigger
                            id="game-select"
                            className="bg-input border-border h-12 rounded-xl"
                            data-ocid="order.select"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="freefire">
                              🔥 Free Fire
                            </SelectItem>
                            <SelectItem value="pubg">🎯 PUBG Mobile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="package-select"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Select Package
                        </label>
                        <Select
                          value={
                            selectedPackage ? String(selectedPackage.id) : ""
                          }
                          onValueChange={(v) => {
                            const pkg = currentPackages.find(
                              (p) => String(p.id) === v,
                            );
                            setSelectedPackage(pkg ?? null);
                          }}
                        >
                          <SelectTrigger
                            id="package-select"
                            className="bg-input border-border h-12 rounded-xl"
                            data-ocid="order.select"
                          >
                            <SelectValue placeholder="Choose a package" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentPackages.map((pkg) => (
                              <SelectItem
                                key={String(pkg.id)}
                                value={String(pkg.id)}
                              >
                                {String(pkg.diamonds)}{" "}
                                {gameTab === "freefire" ? "Diamonds" : "UC"} —{" "}
                                {String(pkg.priceBDT)} BDT
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Right: Payment */}
                    <div className="space-y-5">
                      <h3 className="font-display font-bold text-xl text-foreground">
                        Payment Method
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedPayment("bKash")}
                          className="relative rounded-2xl p-5 flex flex-col items-center gap-2 border-2 transition-all duration-200 hover:scale-105"
                          style={{
                            background: "oklch(0.15 0.028 285)",
                            borderColor:
                              selectedPayment === "bKash"
                                ? "oklch(0.77 0.18 5)"
                                : "oklch(0.22 0.05 285)",
                            boxShadow:
                              selectedPayment === "bKash"
                                ? "0 0 16px oklch(0.77 0.18 5 / 0.3)"
                                : undefined,
                          }}
                          data-ocid="order.radio"
                        >
                          {selectedPayment === "bKash" && (
                            <CheckCircle
                              className="absolute top-2 right-2 w-4 h-4"
                              style={{ color: "oklch(0.77 0.18 5)" }}
                            />
                          )}
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                            style={{ background: "#E2136E" }}
                          >
                            b
                          </div>
                          <span className="font-bold text-sm text-foreground">
                            bKash
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Mobile Banking
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPayment("nagad")}
                          className="relative rounded-2xl p-5 flex flex-col items-center gap-2 border-2 transition-all duration-200 hover:scale-105"
                          style={{
                            background: "oklch(0.15 0.028 285)",
                            borderColor:
                              selectedPayment === "nagad"
                                ? "oklch(0.77 0.18 72)"
                                : "oklch(0.22 0.05 285)",
                            boxShadow:
                              selectedPayment === "nagad"
                                ? "0 0 16px oklch(0.77 0.18 72 / 0.3)"
                                : undefined,
                          }}
                          data-ocid="order.radio"
                        >
                          {selectedPayment === "nagad" && (
                            <CheckCircle
                              className="absolute top-2 right-2 w-4 h-4"
                              style={{ color: "oklch(0.77 0.18 72)" }}
                            />
                          )}
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                            style={{ background: "#F26522" }}
                          >
                            N
                          </div>
                          <span className="font-bold text-sm text-foreground">
                            Nagad
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Mobile Banking
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Amount + CTA */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground font-medium">
                        Amount Payable:
                      </span>
                      <span
                        className="font-display font-bold text-2xl"
                        style={{ color: "oklch(0.61 0.27 293)" }}
                      >
                        {selectedPackage
                          ? `${String(selectedPackage.priceBDT)} BDT`
                          : "— BDT"}
                      </span>
                    </div>
                    <Button
                      size="lg"
                      className="w-full rounded-2xl py-6 text-base font-bold tracking-wide bg-primary hover:bg-accent shadow-glow-purple transition-all duration-300 hover:scale-[1.02]"
                      onClick={handleSubmitOrder}
                      disabled={createOrder.isPending}
                      data-ocid="order.submit_button"
                    >
                      {createOrder.isPending ? (
                        <span className="flex items-center gap-2">
                          <Zap className="w-5 h-5 animate-spin" /> Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="w-5 h-5" /> PROCEED TO PAYMENT
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── Testimonials + Trust ───────────────────────────────────────── */}
      <section
        className="py-24"
        style={{ background: "oklch(0.11 0.025 285)" }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
                What Gamers Say
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase text-foreground mb-8">
                Trusted by Thousands
              </h2>
              <div className="space-y-4">
                {TESTIMONIALS.map((t, tidx) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: tidx * 0.1 }}
                    className="rounded-2xl p-6 border border-border"
                    style={{ background: "oklch(0.15 0.028 285)" }}
                    data-ocid={`testimonials.item.${tidx + 1}`}
                  >
                    <div className="flex gap-1 mb-3">
                      <Star
                        className="w-4 h-4 fill-current"
                        style={{ color: "oklch(0.77 0.18 72)" }}
                      />
                      <Star
                        className="w-4 h-4 fill-current"
                        style={{ color: "oklch(0.77 0.18 72)" }}
                      />
                      <Star
                        className="w-4 h-4 fill-current"
                        style={{ color: "oklch(0.77 0.18 72)" }}
                      />
                      <Star
                        className="w-4 h-4 fill-current"
                        style={{ color: "oklch(0.77 0.18 72)" }}
                      />
                      <Star
                        className="w-4 h-4 fill-current"
                        style={{ color: "oklch(0.77 0.18 72)" }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {t.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.location}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
                Why Choose Us
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase text-foreground mb-8">
                100% Safe &amp; Verified
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: "Secure Payment",
                    desc: "All transactions encrypted and processed via official payment gateways.",
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Instant Delivery",
                    desc: "Diamonds and UC delivered to your account in under 2 minutes.",
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8" />,
                    title: "Verified Seller",
                    desc: "Official partner with verified seller status across major platforms.",
                  },
                  {
                    icon: <Diamond className="w-8 h-8" />,
                    title: "Best Price in BD",
                    desc: "Competitive pricing — we match or beat any verified Bangladesh price.",
                  },
                ].map((badge, bidx) => (
                  <motion.div
                    key={badge.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: bidx * 0.08 }}
                    className="flex items-start gap-4 rounded-2xl p-5 border border-border"
                    style={{ background: "oklch(0.15 0.028 285)" }}
                  >
                    <div
                      className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "oklch(0.52 0.26 292 / 0.15)",
                        color: "oklch(0.61 0.27 293)",
                      }}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-foreground">
                        {badge.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        {badge.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Support ────────────────────────────────────────────────────── */}
      <section id="support" className="py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
              24/7 Help
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase text-foreground mb-4">
              Need Support?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our team is available round the clock to help you with any top-up
              issues.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: "📧", label: "Email", value: "support@bobtopup.com" },
                { icon: "💬", label: "Facebook", value: "fb.com/bobtopup" },
                { icon: "📞", label: "WhatsApp", value: "+880 1700-000000" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl p-5 border border-border"
                  style={{ background: "oklch(0.15 0.028 285)" }}
                >
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {c.label}
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-1">
                    {c.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="border-t border-border pt-16 pb-8"
        style={{ background: "oklch(0.09 0.022 285)" }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  Bobtopup
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bangladesh's most trusted gaming top-up platform. Fast, secure,
                and affordable.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Home", "Games", "How to Top Up", "Support"].map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() =>
                        scrollTo(link.toLowerCase().replace(/ /g, "-"))
                      }
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      data-ocid="footer.link"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
                Game Top-Ups
              </h4>
              <ul className="space-y-2">
                {[
                  "Free Fire",
                  "PUBG Mobile",
                  "Mobile Legends",
                  "Call of Duty",
                  "Valorant",
                ].map((g) => (
                  <li key={g}>
                    <span className="text-muted-foreground text-sm">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@bobtopup.com</li>
                <li>+880 1700-000000</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Bobtopup. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Floating FAB ───────────────────────────────────────────────── */}
      <motion.button
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow-purple"
        style={{ background: "oklch(0.52 0.26 292)" }}
        onClick={() => scrollTo("support")}
        aria-label="Chat support"
        data-ocid="fab.button"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
