
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();

  return (
    <footer className="bg-motta-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-bold text-2xl">
                Torre<span className="text-motta-secondary">de Pisa</span>
              </span>
            </Link>
            <p className="text-motta-400 max-w-xs">
              A mais tradicional de Piraju, desde 1991. Experimente a verdadeira pizza italiana Torre de Pisa.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-motta-400 hover:text-motta-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-motta-400 hover:text-motta-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-motta-400 hover:text-motta-secondary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-motta-400 hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/menu" className="text-motta-400 hover:text-white transition-colors">Cardápio</Link>
              </li>
              <li>
                <Link to="/about" className="text-motta-400 hover:text-white transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/contact" className="text-motta-400 hover:text-white transition-colors">Contato</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock size={16} className="mr-2 text-motta-400" />
                <span className="text-motta-400">Segunda: 18:00-00:00</span>
              </li>
              <li className="flex items-center">
                <Clock size={16} className="mr-2 text-motta-400" />
                <span className="text-motta-400">Terça: Fechado</span>
              </li>
              <li className="flex items-center">
                <Clock size={16} className="mr-2 text-motta-400" />
                <span className="text-motta-400">Quarta-Domingo: 18:00-00:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-motta-400 flex-shrink-0 mt-1" />
                <span className="text-motta-400">Av. São Sebastião, 140 - Jardim Ana Maria, Piraju - SP, 18803-130</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 text-motta-400 flex-shrink-0 mt-1" />
                <div className="flex flex-col">
                  <a href="tel:+551433513504" className="text-motta-400 hover:text-white transition-colors">(14) 3351-3504</a>
                  <a href="tel:+551433512684" className="text-motta-400 hover:text-white transition-colors">(14) 3351-2684</a>
                  <a href="tel:+5514997060492" className="text-motta-400 hover:text-white transition-colors">(14) 99706-0492</a>
                </div>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-motta-400" />
                <a href="mailto:contato@torredepisa.com" className="text-motta-400 hover:text-white transition-colors">contato@torredepisa.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-motta-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-motta-400 text-sm">
            &copy; {currentYear} Torre de Pisa. Todos os direitos reservados.
          </p>
          <p className="text-motta-400 text-sm mt-2 md:mt-0">
            A mais tradicional de Piraju, desde 1991
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
