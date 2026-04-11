import { CAROUSEL } from "@/constant";

const HomeCarousel = () => {
  return (
    <section className="py-20 px-4 border-t border-pastel-blue">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-pastel-dark-blue mb-16">
          Platform Showcase
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAROUSEL.map((item, idx) => (
            <div key={idx} className="group">
              <div className="relative overflow-hidden rounded-lg mb-4 border border-pastel-blue hover:border-pastel-green/30 transition-colors">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-pastel-dark-blue mb-2">
                {item.title}
              </h3>
              <p className="text-pastel-blue">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCarousel;