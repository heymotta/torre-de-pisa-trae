import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PrimaryButton from '@/components/ui/custom/PrimaryButton';
import PizzaCard, { PizzaItem } from '@/components/ui/custom/PizzaCard';

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
  });
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    featured: useRef<HTMLDivElement>(null),
  };

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
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
              A mais tradicional de Piraju, desde 1991
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
                Cardápio
              </PrimaryButton>
              <PrimaryButton size="lg" variant="outline" className="text-white border-white hover:bg-white/20" as={Link} to="/contact">
                Entre em Contato
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      
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
                Uma paixão por pizzas italianas desde 1991
              </h2>
              <p className="text-motta-700 mb-6">
                A Torre de Pisa é uma pizzaria com anos de tradição em Piraju, São Paulo. 
                Desde 1991, oferecemos pizzas saborosas e de qualidade para nossos clientes.
              </p>
              <p className="text-motta-700 mb-8">
                Nosso compromisso é sempre utilizar ingredientes frescos e de alta qualidade 
                na preparação de nossas pizzas, garantindo assim o melhor sabor para nossos clientes. 
                Venha nos visitar e experimente a verdadeira pizza italiana!
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
            <PrimaryButton as={Link} to="/about">
              Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>
      </section>
      
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
                to="/about"
              >
                Nossa História
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
