import { SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_PAYMENT_LINK } from '../config.js';

const { createClient } = window.supabase || {};

let supabase = null;
let isLive = false;

// Initialize Supabase if keys are configured
if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isLive = true;
}

// Reusable Toast Notification System
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 transform -translate-y-4 opacity-0 border`;
    
    if (type === "success") {
        toast.className += " bg-emerald-500 text-white border-emerald-400";
    } else {
        toast.className += " bg-rose-500 text-white border-rose-400";
    }
    
    toast.innerHTML = `
        <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
        <span class="font-semibold text-sm tracking-wide">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove("-translate-y-4", "opacity-0");
    }, 50);
    
    // Animate out
    setTimeout(() => {
        toast.classList.add("-translate-y-4", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Fetch user subscription & trial state
async function checkSubscriptionState() {
    let user = null;
    let subscription_status = 'trial';
    let trial_ends_at = null;
    let created_at = null;
    let email = "";
    let fullName = "";

    // 1. Check for payment success URL redirect to update status
    const urlParams = new URLSearchParams(window.location.search);
    const hasSuccessParam = urlParams.get('payment_success') === 'true';

    if (isLive) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                user = session.user;
                email = user.email;
                fullName = user.user_metadata?.full_name || "Pet Parent";
                
                // Fetch profile
                let { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    if (hasSuccessParam && profile.subscription_status !== 'active') {
                        // Update status to active in database
                        const { data: updatedProfile } = await supabase
                            .from('profiles')
                            .update({ subscription_status: 'active' })
                            .eq('id', user.id)
                            .select()
                            .single();
                        profile = updatedProfile;
                        showToast("Subscription activated! Welcome to Stitch Premium.", "success");
                    }
                    
                    subscription_status = profile.subscription_status;
                    trial_ends_at = new Date(profile.trial_ends_at);
                    created_at = new Date(profile.created_at);
                }
            }
        } catch (err) {
            console.error("Live DB auth error, falling back to mock:", err);
            isLive = false;
        }
    }

    if (!isLive) {
        // Mock Mode using localStorage
        let mockUser = JSON.parse(localStorage.getItem('stitch_mock_user'));
        
        if (!mockUser) {
            // Create a default mock user in trial mode
            const now = new Date();
            const trialEnd = new Date();
            trialEnd.setDate(now.getDate() + 7); // 7 days from now
            
            mockUser = {
                email: "demo@stitchapp.com",
                fullName: "Guest Trainer",
                subscription_status: "trial",
                created_at: now.toISOString(),
                trial_ends_at: trialEnd.toISOString()
            };
            localStorage.setItem('stitch_mock_user', JSON.stringify(mockUser));
        }

        if (hasSuccessParam && mockUser.subscription_status !== 'active') {
            mockUser.subscription_status = 'active';
            localStorage.setItem('stitch_mock_user', JSON.stringify(mockUser));
            showToast("Subscription activated! Welcome to Stitch Premium.", "success");
        }

        user = mockUser;
        email = mockUser.email;
        fullName = mockUser.fullName;
        subscription_status = mockUser.subscription_status;
        trial_ends_at = new Date(mockUser.trial_ends_at);
        created_at = new Date(mockUser.created_at);
    }

    // Redirect to login if no user is found
    if (!user) {
        window.location.href = "../login/code.html";
        return;
    }

    // Clean up query param from URL so refresh doesn't trigger toast again
    if (hasSuccessParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const now = new Date();
    const isExpired = now > trial_ends_at;

    if (subscription_status === 'active') {
        renderSubscriptionBadge(true);
    } else if (isExpired) {
        renderPaywallOverlay(fullName);
    } else {
        const remainingDays = Math.ceil((trial_ends_at - now) / (1000 * 60 * 60 * 24));
        renderSubscriptionBadge(false, remainingDays);
    }
}

// Render small status badge in the header/dashboard
function renderSubscriptionBadge(isPremium, remainingDays = 0) {
    const badge = document.createElement("div");
    badge.id = "subscription-badge";
    badge.className = "fixed top-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105";
    
    if (isPremium) {
        badge.className += " bg-gradient-to-r from-amber-500 to-yellow-600 text-white";
        badge.innerHTML = `
            <span class="material-symbols-outlined text-sm font-semibold">workspace_premium</span>
            <span>Premium Account</span>
        `;
    } else {
        badge.className += " bg-primary text-white";
        badge.innerHTML = `
            <span class="material-symbols-outlined text-sm">hourglass_empty</span>
            <span>Trial Mode: ${remainingDays}d left</span>
        `;
        badge.onclick = () => {
            renderPaywallOverlay(localStorage.getItem('stitch_mock_user') ? JSON.parse(localStorage.getItem('stitch_mock_user')).fullName : "User", true);
        };
    }
    
    document.body.appendChild(badge);
}

// Inject full-page blocking Paywall Overlay
function renderPaywallOverlay(userName, dismissible = false) {
    // Prevent duplicates
    if (document.getElementById("paywall-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "paywall-overlay";
    overlay.className = "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-xl p-4";

    const localSuccessUrl = window.location.href + (window.location.search ? '&' : '?') + 'payment_success=true';

    overlay.innerHTML = `
        <div class="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
            ${dismissible ? `
                <button id="close-paywall" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            ` : ''}
            
            <!-- Header Pattern -->
            <div class="bg-primary text-white p-8 text-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at center, white 1px, transparent 1px); background-size: 10px 10px;"></div>
                <div class="size-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                    <span class="material-symbols-outlined text-3xl font-bold">workspace_premium</span>
                </div>
                <h2 class="text-2xl font-bold tracking-tight">Upgrade to Premium</h2>
                <p class="text-xs text-slate-300 mt-1 font-medium">Hello, ${userName}! Join the premium pack today.</p>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-5 text-center">
                <div>
                    <h3 class="text-lg font-bold text-slate-800">Your 7-Day Free Trial Has Ended</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        To continue using Stitch to manage your clients, schedule training paths, track pack walks, and review agreements, unlock full access.
                    </p>
                </div>

                <!-- Features Checklist -->
                <div class="bg-slate-50 rounded-2xl p-4 text-left space-y-2.5">
                    <div class="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <span class="material-symbols-outlined text-primary text-lg">check_circle</span>
                        <span>Manage Unlimited Clients &amp; Dogs</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <span class="material-symbols-outlined text-primary text-lg">check_circle</span>
                        <span>Live GPS Route Tracking &amp; Walk Logging</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <span class="material-symbols-outlined text-primary text-lg">check_circle</span>
                        <span>Smart Legal Agreements &amp; Signatures</span>
                    </div>
                </div>

                <!-- Pricing -->
                <div class="py-2">
                    <span class="text-4xl font-extrabold text-slate-800">$19.99</span>
                    <span class="text-slate-400 text-sm font-semibold">/ month</span>
                    <p class="text-xs text-slate-400 mt-1">Cancel anytime. 100% money-back guarantee.</p>
                </div>

                <!-- CTA Button -->
                <a href="${STRIPE_PAYMENT_LINK}" target="_blank" class="w-full h-14 bg-amber-500 text-white font-bold text-lg rounded-full shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <span>Subscribe via Stripe</span>
                    <span class="material-symbols-outlined">arrow_forward</span>
                </a>

                <!-- Simulation option for demonstration -->
                <div class="pt-2 border-t border-slate-100">
                    <p class="text-xs text-slate-400">Evaluating the prototype?</p>
                    <a href="${localSuccessUrl}" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1 cursor-pointer">
                        <span class="material-symbols-outlined text-xs">key</span>
                        <span>Simulate Successful Payment Redirect</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    if (dismissible) {
        const closeBtn = overlay.querySelector("#close-paywall");
        if (closeBtn) {
            closeBtn.onclick = () => overlay.remove();
        }
    }
}

// Run the check on load
document.addEventListener("DOMContentLoaded", () => {
    checkSubscriptionState();
});
