import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend/core/services/sp_services.dart';
import 'package:frontend/features/auth/repository/auth_local_repository.dart';
import 'package:frontend/features/auth/repository/auth_remote_repository.dart';
import 'package:frontend/models/user_model.dart';

part "auth_state.dart";

class AuthCubit extends Cubit<AuthState> {
  AuthCubit() : super(AuthInitial());
  final authRemoteRepository = AuthRemoteRepository();
  final authLocalRepository = AuthLocalRepository();
  final spService = SpServices();

  void signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      emit(AuthLoading());
      await authRemoteRepository.signUp(
        name: name,
        email: email,
        password: password,
      );

      emit(AuthSignUp());
      emit(AuthInitial());
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  void logIn({required String email, required String password}) async {
    try {
      emit(AuthLoading());
      final UserModel loggedInUser = await authRemoteRepository.logIn(
        email: email,
        password: password,
      );

      if (loggedInUser.token.isNotEmpty) {
        await spService.setToken(loggedInUser.token);
      }

      await authLocalRepository.insertUser(loggedInUser);
      emit(AuthLoggedIn(loggedInUser));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  void getUserData() async {
    try {
      emit(AuthLoading());
      final UserModel? user = await authRemoteRepository.getUserData();

      if (user != null) {
        emit(AuthLoggedIn(user));
        return;
      } else {
        final UserModel? localUser = await authLocalRepository.getUser();
        if (localUser != null) {
          emit(AuthLoggedIn(localUser));
        }
      }

      emit(AuthInitial());
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }
}
