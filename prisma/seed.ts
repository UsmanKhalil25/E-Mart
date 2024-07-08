import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const companies = [
    { name: "Haier" },
    { name: "TCL" },
    { name: "Gree" },
    { name: "PEL" },
    { name: "Orient" },
    { name: "Hisense" },
    { name: "Kenwood" },
    { name: "Others" },
  ];
  const categories = [
    { name: "Refrigerators" },
    { name: "Washing Machines" },
    { name: "Microwaves" },
    { name: "Air Conditioners" },
    { name: "Vacuum Cleaners" },
    { name: "Televisions" },
    { name: "Others" },
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
  }

  for (const companyData of companies) {
    await prisma.company.upsert({
      where: { name: companyData.name },
      update: {},
      create: companyData,
    });
  }

  const customer1 = await prisma.customer.create({
    data: {
      firstName: "Babar",
      lastName: "Javed",
      phoneNumber: "0300-6276082",
      CNIC: "34202-60986561",
      address: {
        create: {
          district: "District A",
          tehsil: "Tehsil A",
          city: "City A",
          detail: "Detail A",
        },
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      firstName: "Ahmad",
      lastName: "Umair",
      phoneNumber: "0302-8886024",
      CNIC: "34202-90876514",
      address: {
        create: {
          district: "District B",
          tehsil: "Tehsil B",
          city: "City B",
          detail: "Detail B",
        },
      },
    },
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      model: "Model A",
      price: 130000,
      stock: 10,
      description: "Description for Model A",
      companyId: 1,
      categoryId: 1,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      model: "Model B",
      price: 200000,
      stock: 20,
      description: "Description for Model B",
      companyId: 3,
      categoryId: 4,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      model: "Model C",
      price: 130000,
      stock: 30,
      description: "Description for Model C",
      companyId: 2,
      categoryId: 6,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      model: "Model D",
      price: 400000,
      stock: 4,
      description: "Description for Model D",
      companyId: 4,
      categoryId: 4,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
