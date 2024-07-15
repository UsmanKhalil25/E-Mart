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
    { name: "Samsung" },
    { name: "Others" },
  ];
  const categories = [
    { name: "Refrigerators" },
    { name: "Washing Machines" },
    { name: "Microwaves" },
    { name: "Air Conditioners" },
    { name: "Vacuum Cleaners" },
    { name: "LCD" },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
