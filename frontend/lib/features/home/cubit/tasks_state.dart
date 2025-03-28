part of 'tasks_cubit.dart';

sealed class TaskState {
  const TaskState();
}

final class TaskInitial extends TaskState {}

final class TaskLoading extends TaskState {}

final class TaskError extends TaskState {
  final String error;
  TaskError(this.error);
}

final class TaskSuccess extends TaskState {
  final TaskModel taskModel;
  const TaskSuccess(this.taskModel);
}
