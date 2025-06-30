class NotificationService {
  constructor() {
    this.permission = 'default';
    this.subscribers = new Set();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
    
    // Enregistrer le service worker pour les notifications push
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré:', registration);
      } catch (error) {
        console.error('Erreur Service Worker:', error);
      }
    }
  }

  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    }
    return false;
  }

  async sendNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  }

  async sendPromotionNotification(promotion) {
    const title = `🌸 Promotion Flash - ${promotion.discount}% de réduction!`;
    const body = `${promotion.title}\nValable jusqu'à ${new Date(promotion.endDate).toLocaleString('fr-FR')}`;
    
    return this.sendNotification(title, {
      body,
      tag: `promotion-${promotion.id}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Voir l\'offre'
        }
      ]
    });
  }

  // Simuler l'envoi à tous les abonnés
  async broadcastPromotion(promotion, subscribers) {
    console.log(`📢 Diffusion de la promotion "${promotion.title}" à ${subscribers.length} abonnés`);
    
    // En production, ceci ferait appel à un service backend
    // pour envoyer les notifications push à tous les appareils
    subscribers.forEach(subscriber => {
      console.log(`📱 Notification envoyée à ${subscriber.email}`);
    });

    // Envoyer une notification locale pour démonstration
    return this.sendPromotionNotification(promotion);
  }
}

export default new NotificationService();