import { Header } from './_components/Header';
import { Hero } from './_components/Hero';
import { CalendarMockup } from './_components/CalendarMockup';
import { BenefitsStrip } from './_components/BenefitsStrip';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-foreground">
            <Header />
            <Hero />
            <CalendarMockup />
            <BenefitsStrip />
        </div>
    );
}
