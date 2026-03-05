import SubscriptionPlans from "@/features/subscriptions/SubscriptionPlans";

export default function ComptePagaments() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Pagaments i subscripcions</h2>
        <p className="text-gray-400">Gestiona el teu pla actual i consulta el teu historial de facturació.</p>
      </div>
      
      <SubscriptionPlans />
    </div>
  );
}
