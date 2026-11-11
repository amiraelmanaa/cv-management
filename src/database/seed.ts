import { NestFactory } from '@nestjs/core';
import {
  randFirstName,
  randLastName,
  randEmail,
  randPassword,
  randJobTitle,
} from '@ngneat/falso';

import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';

async function seed() {
  // 1 Création de l'application NestJS autonome
  const app = await NestFactory.createApplicationContext(AppModule);

  try {

    // 2 Récupération des services
    const userService = app.get(UserService);
    const cvService = app.get(CvService);
    const skillService = app.get(SkillService);

    console.log('Starting database seeding...');

    // 3 Création des skills
    const skillNames = [
      'JavaScript',
      'Python',
      'Java',
      'React',
      'Angular',
    ];

    const skills = [];

    for (const name of skillNames) {
      const skill = await skillService.create({
        Designation: name,
      });

      skills.push(skill);
    }

    // 4 Création des utilisateurs et de leurs CV
    for (let i = 0; i < 5; i++) {
  const age = 22 + i;

  const user = await userService.create({
    username: `${randFirstName()}${i}`,
    email: randEmail(),
    password: randPassword(),
  });

  for (let j = 0; j < 2; j++) {
    const selectedSkills = skills.slice(j, j + 3);

    await cvService.create({
      name: randLastName(),
      firstname: randFirstName(),
      age: age,
      Cin: String(10000000 + i * 100 + j),
      Job: randJobTitle(),
      path: `uploads/cv-${i}-${j}.pdf`,
      user: user,
      skills: selectedSkills,
    },1); // parametre 1 just zedtou bch tetna7a erreur baad ma badlt el create w walet tekho user.id 
  }
}

    console.log('Database seeding completed successfully!');
  } finally {
    // 5. Fermeture de l'application autonome
    await app.close();
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
});