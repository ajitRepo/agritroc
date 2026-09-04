import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding AgriTroc database...')

  // Clean existing data
  await prisma.rating.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.offerImage.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.otpCode.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      phone: '+221771234567',
      fullName: 'Amadou Diallo',
      city: 'Kaolack',
      address: 'Commune de Kaolack, Bassin arachidier',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Producteur agricole specialise dans l\'arachide et les cereales locales. Fervent partisan de l\'entraide paysanne.',
      ratingAvg: 4.8,
      ratingCount: 12,
      exchangeCount: 8,
      isAdmin: true,
      isVerified: true,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      phone: '+221772345678',
      fullName: 'Fatou Ndiaye',
      city: 'Saint-Louis',
      address: 'Vallee du Fleuve Senegal, Richard Toll',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Eleveuse et maraichere. Je propose du fumier bio et des semences de riz certifiees.',
      ratingAvg: 5.0,
      ratingCount: 15,
      exchangeCount: 11,
      isAdmin: false,
      isVerified: true,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      phone: '+221773456789',
      fullName: 'Ibrahima Sow',
      city: 'Thiès',
      address: 'Pout, Region de Thies',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      bio: 'Proprietaire de materiel agricole et verger de mangues.',
      ratingAvg: 4.7,
      ratingCount: 9,
      exchangeCount: 6,
      isAdmin: false,
      isVerified: true,
    },
  })

  const user4 = await prisma.user.create({
    data: {
      phone: '+221774567890',
      fullName: 'Aissatou Ba',
      city: 'Fatick',
      address: 'Foundiougne, Sine Saloum',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      bio: 'Cooperative de transformation et elevage caprin.',
      ratingAvg: 4.9,
      ratingCount: 7,
      exchangeCount: 5,
      isAdmin: false,
      isVerified: true,
    },
  })

  // Create Offers
  const offer1 = await prisma.offer.create({
    data: {
      userId: user1.id,
      title: 'Semences certifiées de maïs jaune (100 kg) contre semences de mil Souna',
      description: 'Disponible a Kaolack : 100 kg de semences de mais jaune a haut rendement, traitees et pretes a l\'ensemencement. Je recherche en echange 80 a 100 kg de semences de mil Souna 3 certifiees pour la saison des pluies.',
      resourceType: 'seeds',
      offeredResource: '100 kg Semences maïs jaune',
      wantedResource: '80-100 kg Semences mil Souna 3',
      complementType: 'none',
      location: 'Kaolack, Bassin arachidier',
      latitude: 14.1652,
      longitude: -16.0758,
      status: 'active',
      viewsCount: 45,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600', position: 0 },
        ],
      },
    },
  })

  const offer2 = await prisma.offer.create({
    data: {
      userId: user2.id,
      title: 'Tracteur avec herse (disponible 5 jours) contre 2 génisses ou bovins',
      description: 'Mise a disposition d\'un tracteur Massey Ferguson 75 CV avec chauffeur et herse pour travaux de labour / billonnage a Richard Toll ou environs. Echange possible contre 2 jeunes genisses de race locale saines ou petit betail equivalent.',
      resourceType: 'machinery',
      offeredResource: 'Tracteur 75 CV (5 jours de labour)',
      wantedResource: '2 Génisses locales ou petit bétail',
      complementType: 'money',
      complementDesc: 'Possibilité de complément en carburant si zone éloignée',
      location: 'Saint-Louis, Richard Toll',
      latitude: 16.0326,
      longitude: -16.4818,
      status: 'active',
      viewsCount: 88,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600', position: 0 },
        ],
      },
    },
  })

  const offer3 = await prisma.offer.create({
    data: {
      userId: user3.id,
      title: 'Parcelle agricole irriguée (2 hectares) contre service de forage / pompage solaire',
      description: 'Parcelle fertile cloturee a Pout disponible pour bail de 2 ans. Sol propice au maraichage (oignon, piment, tomate). Cherche artisan ou entrepreneur pour installation complete d\'un systeme de pompage solaire sur puits existant.',
      resourceType: 'land',
      offeredResource: '2 hectares terres irriguées (2 ans)',
      wantedResource: 'Installation kit solaire de pompage',
      complementType: 'other',
      complementDesc: 'Partage de recolte possible la premiere annee',
      location: 'Thiès, Pout',
      latitude: 14.7733,
      longitude: -17.0624,
      status: 'active',
      viewsCount: 62,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', position: 0 },
        ],
      },
    },
  })

  const offer4 = await prisma.offer.create({
    data: {
      userId: user4.id,
      title: '5 Chèvres du Sahel contre 15 sacs d\'aliments bétail concentrés',
      description: 'Troque 5 belles chevres du Sahel en tres bonne sante (vaccinees et suivies) contre 15 sacs d\'aliments pour betail (tourteaux d\'arachide ou concentres proteiques).',
      resourceType: 'livestock',
      offeredResource: '5 Chèvres du Sahel reproductrices',
      wantedResource: '15 sacs aliment bétail / tourteaux',
      complementType: 'none',
      location: 'Fatick, Foundiougne',
      latitude: 14.3314,
      longitude: -16.4719,
      status: 'active',
      viewsCount: 39,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600', position: 0 },
        ],
      },
    },
  })

  const offer5 = await prisma.offer.create({
    data: {
      userId: user1.id,
      title: '2 Tonnes d\'oignon violet de Galmi contre 3 tonnes de foin de niébé',
      description: 'Superbe recolte d\'oignons de qualite bien seches a Kaolack. Echange contre foin de niebe sec et propre pour l\'affouragement de mon troupeau.',
      resourceType: 'production',
      offeredResource: '2 Tonnes Oignon violet de Galmi',
      wantedResource: '3 Tonnes Foin de niébé de qualité',
      complementType: 'none',
      location: 'Kaolack, Ndoffane',
      latitude: 13.9167,
      longitude: -15.9333,
      status: 'active',
      viewsCount: 51,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600', position: 0 },
        ],
      },
    },
  })

  // Create a conversation between user2 and user1 on offer1
  const conv1 = await prisma.conversation.create({
    data: {
      offerId: offer1.id,
      initiatorId: user2.id,
      ownerId: user1.id,
      status: 'open',
      messages: {
        create: [
          {
            senderId: user2.id,
            content: 'Salam Amadou, j\'ai 90 kg de semences de mil Souna certifiees ISRA. Est-ce que cela vous convient pour l\'echange ?',
            readAt: new Date(),
          },
          {
            senderId: user1.id,
            content: 'Wa alaykoum salam Fatou ! Oui c\'est parfait. Comment organise-t-on le transport ou la rencontre ?',
            readAt: new Date(),
          },
          {
            senderId: user2.id,
            content: 'Je peux passer au marche de Kaolack jeudi matin avec les sacs.',
          },
        ],
      },
    },
  })

  console.log(`✅ Seed finished: ${await prisma.user.count()} users, ${await prisma.offer.count()} offers, ${await prisma.conversation.count()} conversations created.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
