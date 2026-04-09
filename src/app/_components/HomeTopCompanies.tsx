import { TOP_COMPANIES } from "@/constant";

const HomeTopCompanies = () => {
  return (
    <section className="py-20 px-4 border-t border-slate-700">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Trusted by Leading Brands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {TOP_COMPANIES.map((company, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 w-full flex flex-col items-center justify-center hover:border-green-500/30 transition-colors"
            >
              <div className="text-4xl mb-2">{company.logo}</div>
              <p className="text-slate-300 font-semibold text-center">
                {company.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTopCompanies;