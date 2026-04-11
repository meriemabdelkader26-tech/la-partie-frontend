import { TOP_COMPANIES } from "@/constant";

const HomeTopCompanies = () => {
  return (
    <section className="py-20 px-4 border-t border-pastel-blue">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-pastel-dark-blue mb-16">
          Trusted by Leading Brands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {TOP_COMPANIES.map((company, idx) => (
            <div
              key={idx}
              className="bg-pastel-blue/50 border border-pastel-blue rounded-lg p-8 w-full flex flex-col items-center justify-center hover:border-pastel-green/30 transition-colors"
            >
              <div className="text-4xl mb-2">{company.logo}</div>
              <p className="text-pastel-blue font-semibold text-center">
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