import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react-native';
import { useHealthCheck } from '@arden/core';
import { lightColors, darkColors } from '@arden/ui/styles/colors';

export function HealthStatus() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  const { data: health, isLoading, error } = useHealthCheck();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Checking system health...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.statusRow}>
          <XCircle size={16} color={colors.error} />
          <Text style={styles.errorText}>System offline</Text>
        </View>
      </View>
    );
  }

  if (!health) return null;

  const getStatusIcon = () => {
    switch (health.status) {
      case 'ok':
        return <CheckCircle size={16} color={colors.success} />;
      case 'degraded':
        return <AlertCircle size={16} color={colors.warning} />;
      default:
        return <XCircle size={16} color={colors.error} />;
    }
  };

  const getStatusText = () => {
    switch (health.status) {
      case 'ok':
        return 'All systems operational';
      case 'degraded':
        return 'Some services degraded';
      default:
        return 'System issues detected';
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'ok':
        return colors.success;
      case 'degraded':
        return colors.warning;
      default:
        return colors.error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
      </View>
      {health.database && <Text style={styles.detailText}>Database: {health.database}</Text>}
    </View>
  );
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 6,
      marginHorizontal: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '500',
    },
    detailText: {
      fontSize: 12,
      color: colors.text2,
      marginTop: 4,
      marginLeft: 24,
    },
    loadingText: {
      fontSize: 14,
      color: colors.text2,
      fontStyle: 'italic',
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      fontWeight: '500',
    },
  });
