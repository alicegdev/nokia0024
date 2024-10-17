import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
});

router.get('/health', (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200);
});

router.get('/privacy', (req: Request, res: Response, next: NextFunction) => {
  res.send(`
    Privacy Policy

    1. Introduction
    We respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, disclose, and protect your information.

    2. Information We Collect
    We may collect information about you in various ways, including but not limited to:
    - Personal information you provide directly (e.g., name, email address) when using our app.
    - Usage data collected automatically (e.g., information about your device, IP address).

    3. Use of Your Information
    We use the information we collect for:
    - Providing and managing our application.
    - Improving our application and personalizing the user experience.
    - Communicating with you regarding your use of our application.

    4. Sharing Your Information
    We do not share your personal information with third parties, except as necessary to provide our services or as required by law.

    5. Security of Your Information
    We take reasonable measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.

    6. Your Rights
    You have the right to access your personal information, correct it, or request its deletion. If you have any questions regarding your rights, please contact us.

    7. Changes to This Policy
    We may update this privacy policy from time to time. We will notify you of changes by posting the new policy on this page.

    8. Contact
    If you have any questions or concerns regarding this privacy policy, please contact us.

    Last updated: October 17th, 2024.
  `);
});
export default router;