import 'package:flutter/material.dart';
import 'package:frontend/features/auth/pages/login_page.dart';

class SignupPage extends StatefulWidget {
  static MaterialPageRoute route() =>
      MaterialPageRoute(builder: (context) => const SignupPage());
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final nameController = TextEditingController();
  final formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    nameController.dispose();
    super.dispose();
  }

  void signUpUser() {
    if (formKey.currentState!.validate()) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "SIGN UP.",
                style: TextStyle(fontSize: 50, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 30),
              TextFormField(
                controller: emailController,
                decoration: InputDecoration(hintText: 'Name'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Name field cannot be empty';
                  }
                  return null;
                },
              ),
              SizedBox(height: 15),
              TextFormField(
                controller: passwordController,
                decoration: InputDecoration(hintText: 'Email'),
                validator: (value) {
                  if (value == null ||
                      value.trim().isEmpty ||
                      !value.trim().contains('@')) {
                    return 'Email field is not valid';
                  }
                  return null;
                },
              ),
              SizedBox(height: 15),
              TextFormField(
                controller: nameController,
                decoration: InputDecoration(hintText: 'Password'),
                validator: (value) {
                  if (value == null ||
                      value.trim().isEmpty ||
                      value.trim().length < 6) {
                    return 'Password field is not valid';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => signUpUser(),
                child: Text(
                  'Sign UP',
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
              SizedBox(height: 15),
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(LoginPage.route());
                },
                child: RichText(
                  text: TextSpan(
                    style: Theme.of(context).textTheme.titleMedium,
                    text: 'Already have an Account? ',
                    children: [
                      TextSpan(
                        text: 'Sign In',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
