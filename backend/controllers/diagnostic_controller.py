class DiagnosticController:
    @staticmethod
    def analyze(description):
        keywords = {
            "batterie": "Problème probable de batterie (charge ou cosses).",
            "moteur": "Risque de surchauffe ou problème d'injection détecté.",
            "pneu": "Anomalie pression ou usure prononcée des pneumatiques.",
            "frein": "Système de freinage : Pression basse ou plaquettes usées."
        }
        desc_lower = description.lower()
        findings = [v for k, v in keywords.items() if k in desc_lower]
        return {
            "suggestion": " ".join(findings) if findings else "Analyse terminée : Aucune anomalie critique détectée par l'algorithme.",
            "status": "detected" if findings else "unknown"
        }
