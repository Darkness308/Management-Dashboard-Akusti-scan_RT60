# Contributing to RT60 Raumakustik-Analyse

Vielen Dank für dein Interesse, an diesem Projekt mitzuwirken!

## 🚀 Quick Start

1. **Repository forken und klonen**
   ```bash
   git clone https://github.com/your-username/Management-Dashboard-Akusti-scan_RT60.git
   cd Management-Dashboard-Akusti-scan_RT60
   ```

2. **Development Branch erstellen**
   ```bash
   git checkout -b feature/meine-neue-funktion
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Tests ausführen**
   ```bash
   pytest tests/ -v
   ```

## 📝 Code Style Guidelines

### Python (Backend)

```bash
# Code Formatting (Black)
black src/ tests/

# Linting (Flake8)
flake8 src/ tests/ --max-line-length=100

# Type Checking (MyPy)
mypy src/ --ignore-missing-imports
```

**Regeln:**
- Max. Zeilenlänge: 100 Zeichen
- Docstrings für alle öffentlichen Funktionen/Klassen
- Type Hints verwenden
- PEP 8 Standard

### Commit Messages

Wir verwenden **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Neues Feature
- `fix`: Bug Fix
- `docs`: Dokumentation
- `test`: Tests hinzufügen/ändern
- `refactor`: Code-Umstrukturierung
- `perf`: Performance-Verbesserung
- `chore`: Build/Dependencies

**Beispiele:**
```
feat(acoustics): add Eyring formula implementation
fix(api): correct RT60 calculation for high absorption
docs(readme): update installation instructions
test(formulas): add edge case tests for Sabine formula
```

## 🧪 Testing

### Unit Tests schreiben

```python
# tests/test_new_feature.py
import pytest
from src.acoustics.formulas import my_new_function

class TestNewFeature:
    def test_basic_case(self):
        """Test der Basis-Funktionalität"""
        result = my_new_function(input=10.0)
        assert result == pytest.approx(expected, abs=0.01)

    def test_edge_case(self):
        """Test von Edge Cases"""
        with pytest.raises(ValueError):
            my_new_function(input=-1)
```

### Coverage-Ziel

- **Minimum:** 70%
- **Ziel:** 80%+

```bash
pytest --cov=src --cov-report=html tests/
# Öffne htmlcov/index.html im Browser
```

## 📦 Pull Request Prozess

1. **Branch aktuell halten**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Tests ausführen**
   ```bash
   pytest tests/ -v
   black --check src/ tests/
   flake8 src/ tests/
   ```

3. **Pull Request erstellen**
   - Beschreibung: Was wurde geändert und warum?
   - Screenshots (bei UI-Änderungen)
   - Link zu Issue (falls vorhanden)

4. **Code Review abwarten**
   - Mindestens 1 Approval erforderlich
   - CI muss grün sein

## 🐛 Bug Reports

Verwende das **GitHub Issue Template**:

```markdown
**Beschreibung des Bugs:**
[Klare Beschreibung]

**Schritte zur Reproduktion:**
1. Schritt 1
2. Schritt 2

**Erwartetes Verhalten:**
[Was sollte passieren]

**Tatsächliches Verhalten:**
[Was passiert wirklich]

**Umgebung:**
- OS: [z.B. Ubuntu 22.04]
- Python Version: [z.B. 3.11.5]
- Branch: [z.B. main]
```

## 💡 Feature Requests

**Vor dem Erstellen:**
1. Prüfe ob ähnliches Issue existiert
2. Diskutiere in Discussions

**Template:**
```markdown
**Problem/Bedürfnis:**
[Was soll gelöst werden?]

**Vorgeschlagene Lösung:**
[Deine Idee]

**Alternativen:**
[Andere Ansätze]

**Zusätzlicher Kontext:**
[Screenshots, Links, etc.]
```

## 🔐 Security

**Sicherheitslücken NICHT öffentlich melden!**

Sende stattdessen eine E-Mail an: security@rt60-scanner.com

## 📄 Lizenz

Mit deinem Beitrag stimmst du zu, dass dein Code unter der gleichen Lizenz wie das Projekt veröffentlicht wird.

---

**Fragen?** Öffne ein Issue oder schreibe in die Discussions!
