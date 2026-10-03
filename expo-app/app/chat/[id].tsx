// ============================================================================
// Chat Detail Screen (ports chat_detail_screen.dart)
// Local, simulated messaging: no backend or socket (same as Flutter).
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useToast } from '@/components/ui/Toast';
import { palette } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { text: "Hello! I'm interested in the property at Lekki Phase 1.", isMe: true, time: '10:30 AM' },
  { text: 'Good morning! Yes, the property is still available. Would you like to schedule an inspection?', isMe: false, time: '10:32 AM' },
  { text: 'That would be great. Is this weekend available?', isMe: true, time: '10:33 AM' },
  { text: "Yes, Saturday works. How about 11am? I'll meet you at the estate gate.", isMe: false, time: '10:35 AM' },
  { text: "The estate is well-maintained with 24/7 security and you'll love the swimming pool area 🏊‍♂️", isMe: false, time: '10:35 AM' },
  { text: 'Perfect! Saturday at 11am it is. Can you share the exact address?', isMe: true, time: '10:38 AM' },
  { text: "12 Admiralty Way, Lekki Phase 1, Lagos. There's a big blue gate - you can't miss it. Ask for Chief Adebayo at the security post.", isMe: false, time: '10:40 AM' },
  { text: 'Thank you! One more question - does the rent include service charge?', isMe: true, time: '10:42 AM' },
  { text: 'The annual rent is ₦3.5M and service charge is separate at ₦1M per year. I can break down all the move-in costs when we meet.', isMe: false, time: '10:45 AM' },
].map((m, i) => ({ ...m, id: i }));

export default function ChatDetailScreen() {
  const params = useLocalSearchParams<{ id: string; name?: string; propertyTitle?: string }>();
  const recipientName = params.name || 'Landlord / Agent';
  const propertyTitle = params.propertyTitle ?? '';

  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const listRef = useRef<FlatList<Message>>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const comingSoon = (feature: string) => () => toast.show(`${feature} coming soon!`, 'info');

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now(), text, isMe: true, time: 'Just now' }]);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const headerTitle = (
    <View style={styles.titleRow}>
      <View>
        <View style={[styles.avatar, { backgroundColor: colors.primarySurface }]}>
          <AppText size={14} weight="bold" color={colors.primary}>
            {recipientName.substring(0, 2).toUpperCase()}
          </AppText>
        </View>
        <View style={[styles.online, { backgroundColor: palette.success, borderColor: colors.surface }]} />
      </View>
      <View style={styles.titleText}>
        <AppText variant="titleMedium" weight="semibold" numberOfLines={1}>
          {recipientName}
        </AppText>
        <AppText size={12} weight="medium" color={palette.success}>
          Online
        </AppText>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        title=""
        right={
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Call" hitSlop={8} onPress={comingSoon('Call')} style={styles.action}>
              <Ionicons name="call-outline" size={24} color={colors.textPrimary} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="More options" hitSlop={8} onPress={comingSoon('More Options')} style={styles.action}>
              <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>
        }
      />
      {/* Recipient block overlays the (empty) title area of the header */}
      <View style={[styles.titleOverlay, { top: insets.top }]} pointerEvents="none">
        {headerTitle}
      </View>

      {propertyTitle ? (
        <View style={[styles.contextBar, { backgroundColor: colors.primarySurface }]}>
          <Ionicons name="home-outline" size={18} color={colors.primary} />
          <AppText size={13} weight="medium" color={colors.primary} numberOfLines={1} style={styles.contextText}>
            {propertyTitle}
          </AppText>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item, index }) => {
          const showAvatar = !item.isMe && (index === 0 || messages[index - 1].isMe);
          return (
            <View style={[styles.msgRow, { justifyContent: item.isMe ? 'flex-end' : 'flex-start' }]}>
              {!item.isMe ? (
                showAvatar ? (
                  <View style={[styles.miniAvatar, { backgroundColor: colors.primarySurface }]}>
                    <AppText size={11} weight="bold" color={colors.primary}>
                      {recipientName.substring(0, 1)}
                    </AppText>
                  </View>
                ) : (
                  <View style={styles.avatarSpacer} />
                )
              ) : null}

              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: item.isMe ? colors.primary : colors.surfaceVariant,
                    borderBottomLeftRadius: item.isMe ? 18 : 4,
                    borderBottomRightRadius: item.isMe ? 4 : 18,
                  },
                ]}
              >
                <AppText size={14.5} color={item.isMe ? '#FFFFFF' : colors.textPrimary} style={styles.msgText}>
                  {item.text}
                </AppText>
                <View style={styles.meta}>
                  <AppText size={11} color={item.isMe ? 'rgba(255,255,255,0.7)' : colors.textTertiary}>
                    {item.time}
                  </AppText>
                  {item.isMe ? (
                    <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" style={styles.ticks} />
                  ) : null}
                </View>
              </View>
            </View>
          );
        }}
      />

      <View
        style={[
          styles.inputBar,
          { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Attachments"
          onPress={comingSoon('Attachments')}
          style={[styles.attach, { backgroundColor: colors.surfaceVariant }]}
        >
          <Ionicons name="add" size={22} color={colors.textSecondary} />
        </Pressable>

        <View style={[styles.inputWrap, { backgroundColor: colors.surfaceVariant }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            multiline
            autoCapitalize="sentences"
            selectionColor={colors.primary}
            style={[styles.input, { color: colors.textPrimary }]}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          onPress={sendMessage}
          style={[styles.send, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  titleOverlay: {
    position: 'absolute',
    left: 56,
    right: 96,
    height: 56,
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleText: { flex: 1, marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  online: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  actions: { flexDirection: 'row' },
  action: { padding: 8 },

  contextBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  contextText: { flex: 1, marginHorizontal: 8 },

  list: { paddingHorizontal: 16, paddingVertical: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSpacer: { width: 36 },
  bubble: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxWidth: '82%',
  },
  msgText: { lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  ticks: { marginLeft: 4 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  attach: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, maxHeight: 120, marginHorizontal: 10, borderRadius: 24 },
  input: { fontSize: 15, paddingHorizontal: 18, paddingVertical: 12, maxHeight: 120 },
  send: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
