import { CAROUSEL } from "@/constant";

const HomeCarousel = () => {
  return (
    <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Platform Showcase
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how brands and influencers create amazing campaigns together
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAROUSEL.map((item, idx) => (
            <div 
              key={idx} 
              className="group animate-fadeInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 border-2 border-black/5 hover:border-black/20 transition-all duration-300 shadow-soft hover:shadow-large">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <h3 className="text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-200">{item.description}</p>
                </div>
              </div>
              <div className="group-hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCarousel;