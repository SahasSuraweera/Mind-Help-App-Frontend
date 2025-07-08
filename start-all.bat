@echo off

REM Start Patient Service
start cmd /k "cd patient-service && mvn spring-boot:run"

REM Start Payment Service
start cmd /k "cd payment-service && mvn spring-boot:run"

REM Start Appointment Service
start cmd /k "cd appointment-service && mvn spring-boot:run"

REM Start Payment Service
start cmd /k "cd payment-service && mvn spring-boot:run"

REM Start Payment Service
start cmd /k "cd staff-service && mvn spring-boot:run"

REM Start React Frontend
start cmd /k "cd frontend && npm start"