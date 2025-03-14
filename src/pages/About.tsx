
import { MapPin, Phone, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const About = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-black/50">
            <img 
              src="https://images.unsplash.com/photo-1613564834361-9436948817d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" 
              alt="Pizzaria" 
              className="w-full h-full object-cover opacity-75"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">Sobre Nós</h1>
              <p className="text-motta-200 text-lg md:text-xl max-w-2xl mx-auto">
                Descubra a história por trás da pizzaria mais tradicional de Piraju
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1741&q=80" 
                  alt="Dono da Pizzaria" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-motta-950 mb-4">
                  Nossa História
                </h2>
                <div className="prose text-motta-700">
                  <p className="mb-4">
                    Olá, eu sou o Silvio, o proprietário da Pizzaria Torre de Pisa em Piraju, São Paulo, e estamos orgulhosos de estar no mercado há 32 anos. Desde o início, minha paixão por pizza me inspirou a transformar essa paixão em um negócio duradouro. Com dedicação e esforço contínuo, estabelecemos nossa pizzaria como um local de referência em qualidade e sabor na região.
                  </p>
                  <p>
                    Nossa missão é proporcionar a você pizzas verdadeiramente deliciosas que vão colocar um sorriso no seu rosto. Utilizamos os melhores ingredientes e técnicas de preparo para garantir que cada fatia de pizza seja uma experiência memorável. Convidamos você a nos visitar e descobrir por si mesmo a pizza que vai alegrar o seu dia!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facts & Info Section */}
        <div className="bg-motta-100 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-motta-950 mb-12">
                Informações e Localização
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Location */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-motta-primary mr-2" />
                    <h3 className="font-display font-semibold text-xl text-motta-900">Localização</h3>
                  </div>
                  <p className="text-motta-700 mb-4">
                    Av. São Sebastião, 140<br />
                    Jardim Ana Maria<br />
                    Piraju - SP, 18803-130
                  </p>
                  <a 
                    href="https://maps.google.com/?q=Av. São Sebastião, 140 - Jardim Ana Maria, Piraju - SP, 18803-130" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-motta-primary hover:underline font-medium inline-flex items-center"
                  >
                    Ver no mapa
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>

                {/* Hours */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-motta-primary mr-2" />
                    <h3 className="font-display font-semibold text-xl text-motta-900">Horário de Funcionamento</h3>
                  </div>
                  <ul className="text-motta-700 space-y-2">
                    <li className="flex justify-between">
                      <span>Segunda-feira:</span>
                      <span>18:00-00:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Terça-feira:</span>
                      <span>Fechado</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quarta-feira:</span>
                      <span>18:00-00:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quinta-feira:</span>
                      <span>18:00-00:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sexta-feira:</span>
                      <span>18:00-00:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sábado:</span>
                      <span>18:00-00:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Domingo:</span>
                      <span>18:00-00:00</span>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <Phone className="w-6 h-6 text-motta-primary mr-2" />
                    <h3 className="font-display font-semibold text-xl text-motta-900">Contato</h3>
                  </div>
                  <ul className="text-motta-700 space-y-2">
                    <li>
                      <a href="tel:+551433513504" className="hover:text-motta-primary transition-colors">
                        (14) 3351-3504
                      </a>
                    </li>
                    <li>
                      <a href="tel:+551433512684" className="hover:text-motta-primary transition-colors">
                        (14) 3351-2684
                      </a>
                    </li>
                    <li>
                      <a href="tel:+5514997060492" className="hover:text-motta-primary transition-colors">
                        (14) 99706-0492
                      </a>
                    </li>
                  </ul>
                  <p className="mt-4 text-motta-700">
                    A mais tradicional de Piraju, desde 1991
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="w-full h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.196969683626!2d-49.389917724942865!3d-23.19757584687929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c01585953f0bef%3A0x1d9c33c8ef50f1df!2sAv.%20S%C3%A3o%20Sebasti%C3%A3o%2C%20140%20-%20Jardim%20Ana%20Maria%2C%20Piraju%20-%20SP%2C%2018800-000!5e0!3m2!1spt-BR!2sbr!4v1697728431274!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
