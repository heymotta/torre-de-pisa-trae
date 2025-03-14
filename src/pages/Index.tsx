
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PrimaryButton from '@/components/ui/custom/PrimaryButton';
import PizzaCard, { PizzaItem } from '@/components/ui/custom/PizzaCard';

// Mock featured products - in a real app, these would come from an API
const featuredProducts: PizzaItem[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'A clássica pizza italiana com molho de tomate, muçarela fresca e manjericão.',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Manjericão', 'Azeite de oliva'],
    category: 'tradicional'
  },
  {
    id: '2',
    name: 'Pepperoni',
    description: 'Pizza com generosas fatias de pepperoni e queijo muçarela derretido.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Pepperoni'],
    category: 'especial'
  },
  {
    id: '3',
    name: 'Quatro Queijos',
    description: 'Deliciosa combinação de quatro queijos diferentes: muçarela, parmesão, provolone e gorgonzola.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4fe3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Parmesão', 'Provolone', 'Gorgonzola'],
    category: 'especial'
  }
];

const Index = () => {
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({
    hero: false,
    about: false,
    featured: false,
    testimonials: false,
  });
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    featured: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
  };

  // Intersection observer for animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    Object.entries(sectionRefs).forEach(([key, ref]) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({ ...prev, [key]: true }));
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
        observers.push(observer);
      }
    });
    
    // Cleanup observers
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={sectionRefs.hero}
        className="pt-20 min-h-[90vh] flex items-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
            alt="Torre de Pisa Background" 
            className="w-full h-full object-cover object-center brightness-50"
          />
        </div>
        
        <div 
          className={`container relative z-10 px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${
            isVisible.hero 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-2xl">
            <span className="inline-block bg-motta-secondary text-motta-900 font-semibold px-4 py-1 rounded-full mb-4 text-sm">
              A melhor pizzaria da cidade
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              Experimente o <span className="text-motta-primary">verdadeiro</span> sabor italiano
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Pizzas artesanais preparadas com ingredientes selecionados e muito amor. 
              Uma experiência única em cada fatia.
            </p>
            <div className="flex flex-wrap gap-4">
              <PrimaryButton size="lg" as={Link} to="/menu">
                Ver Cardápio
              </PrimaryButton>
              <PrimaryButton size="lg" variant="outline" className="text-white border-white hover:bg-white/20" as={Link} to="/about">
                Conheça Nossa História
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section 
        ref={sectionRefs.about}
        className="py-20 bg-motta-50"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className={`transition-all duration-1000 delay-300 ${
                isVisible.about 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-10'
              }`}
            >
              <span className="text-motta-primary font-semibold">NOSSA HISTÓRIA</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mt-2 mb-6">
                Uma paixão por pizzas italianas desde 2015
              </h2>
              <p className="text-motta-700 mb-6">
                Tudo começou com uma simples ideia: criar pizzas que realmente fazem diferença. 
                Na Torre de Pisa, acreditamos que a qualidade dos ingredientes e o cuidado no preparo 
                são essenciais para criar uma experiência gastronômica inesquecível.
              </p>
              <p className="text-motta-700 mb-8">
                Nossas pizzas são feitas diariamente com ingredientes selecionados, massa artesanal e 
                molhos preparados na casa. Cada pizza é assada no ponto perfeito em forno a lenha e montada com carinho 
                por nossa equipe de especialistas apaixonados por gastronomia italiana.
              </p>
              <PrimaryButton as={Link} to="/about">
                Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
              </PrimaryButton>
            </div>
            
            <div 
              className={`relative transition-all duration-1000 delay-500 ${
                isVisible.about 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
                  alt="Torre de Pisa Chef" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-motta-primary rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-motta-secondary rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section 
        ref={sectionRefs.featured}
        className="py-20"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-motta-primary font-semibold">DESTAQUES</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mt-2 mb-6">
              Nossas Pizzas Mais Pedidas
            </h2>
            <p className="text-motta-700">
              Conheça as pizzas que fazem mais sucesso entre nossos clientes. 
              Cada uma com um sabor único e irresistível.
            </p>
          </div>
          
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
              isVisible.featured 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            {featuredProducts.map((pizza, index) => (
              <div 
                key={pizza.id}
                className={`transition-all duration-700 delay-${index * 200}`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  opacity: isVisible.featured ? 1 : 0,
                  transform: isVisible.featured ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <PizzaCard pizza={pizza} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <PrimaryButton as={Link} to="/menu">
              Ver Cardápio Completo <ArrowRight className="ml-2 h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section 
        ref={sectionRefs.testimonials}
        className="py-20 bg-motta-950 text-white"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-1000 ${
              isVisible.testimonials 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-motta-secondary font-semibold">DEPOIMENTOS</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mt-2 mb-6">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-motta-400">
              Veja o que nossos clientes estão falando sobre sua experiência com as 
              pizzas Torre de Pisa.
            </p>
          </div>
          
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${
              isVisible.testimonials 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Testimonial 1 */}
            <div className="bg-motta-900/50 p-6 rounded-xl backdrop-blur-sm border border-motta-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Cliente" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Ricardo Silva</h3>
                  <div className="flex text-motta-secondary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-motta-300">
                "A melhor pizza que já comi! A massa estava no ponto perfeito e os 
                ingredientes super frescos. O atendimento também foi excelente."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-motta-900/50 p-6 rounded-xl backdrop-blur-sm border border-motta-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Cliente" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Amanda Oliveira</h3>
                  <div className="flex text-motta-secondary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-motta-300">
                "Adoro a Pizza Quatro Queijos! A combinação de queijos é perfeita e a massa fina e crocante é incrível. 
                Sempre peço quando tenho visitas em casa."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-motta-900/50 p-6 rounded-xl backdrop-blur-sm border border-motta-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/62.jpg" 
                    alt="Cliente" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Carlos Mendes</h3>
                  <div className="flex text-motta-secondary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-motta-300">
                "A Pizza Vegetariana é sensacional! Como opção vegetariana, é difícil encontrar 
                pizzas tão saborosas. Recomendo para todos os meus amigos."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-motta-primary text-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Está com fome? Peça a sua Torre de Pisa agora!
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Experimente a melhor pizza italiana da cidade. Entregamos em toda a região.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PrimaryButton 
                size="lg" 
                className="bg-white text-motta-primary hover:bg-white/90"
                as={Link}
                to="/menu"
              >
                Ver Cardápio
              </PrimaryButton>
              <PrimaryButton 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                as={Link}
                to="/contact"
              >
                Entre em Contato
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
